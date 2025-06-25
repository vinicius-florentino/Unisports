<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\CommentAnswer;
use App\Events\EventCommentAnswer;
use App\Models\Comment;
use App\Events\EventComment;
use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class EventsController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'sport_id' => 'nullable|integer|exists:sports,id'
        ]);

        $search = $request->search;
        $sportId = $request->sport_id;

        $data = Event::with(['sport', 'user'])
            ->withCount('participants')
            ->where('start_at', '>=', Carbon::now())
            ->when($search, function ($query) use ($search) {
                return $query->where('title', 'like', '%' . $search . '%');
            })
            ->when($sportId, function ($query) use ($sportId) {
                return $query->where('sport_id', $sportId);
            })
            ->latest('start_at')
            ->paginate();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function show(Request $request, int $id)
    {
        $data = Event::with(['sport', 'user', 'participants', 'participants.user'])->find($id);

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function dashboardIndex(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Event::with(['sport'])
            ->withCount('participants')
            ->where('user_id', $userId)
            ->get();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function dashboardStore(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'max_participants' => 'nullable|integer|min:1',
            'price' => 'nullable|decimal:0,2',
            'split_price_by_participants' => 'required|boolean',
            'start_at' => [
                'required',
                'date',
                function ($attr, $value, $fail) {
                    if (!Carbon::parse($value)->isFuture()) {
                        $fail('A data deve ser uma data futura');
                    }
                },
            ],
            'finishes_at' => 'nullable|date|after_or_equal:start_at',
            'location' => 'nullable|array',
            'sport_id' => 'nullable|integer|exists:sports,id'
        ]);

        try {
            DB::beginTransaction();

            $data = Event::create([
                'user_id' => $userId,
                'title' => $request->title,
                'description' => $request->description,
                'max_participants' => $request->max_participants,
                'price' => $request->price,
                'split_price_by_participants' => $request->split_price_by_participants,
                'start_at' => $request->start_at,
                'finishes_at' => $request->finishes_at,
                'location' => $request->location,
                'sport_id' => $request->sport_id
            ]);

            Participant::create([
                'user_id' => $userId,
                'event_id' => $data->id
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            "status" => "success",
            "message" => "Evento criado com sucesso!",
            "data" => $data
        ]);
    }

    public function dashboardUpdate(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Event::with(['sport'])
            ->where('user_id', $userId)
            ->where('id', $id)
            ->firstOrFail();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:2000',
            'max_participants' => 'nullable|integer|min:1',
            'price' => 'nullable|decimal:0,2',
            'split_price_by_participants' => 'required|boolean',
            'start_at' => [
                'required',
                'date',
                function ($attr, $value, $fail) {
                    if (!Carbon::parse($value)->isFuture()) {
                        $fail('A data deve ser uma data futura');
                    }
                },
            ],
            'finishes_at' => 'nullable|date|after_or_equal:start_at',
            'location' => 'nullable|array',
            'sport_id' => 'nullable|integer|exists:sports,id'
        ]);

        if ($request->title !== $data->title) {
            $data->title = $request->title;
        }

        if ($request->description !== $data->description) {
            $data->description = $request->description;
        }

        if ($request->max_participants !== $data->max_participants) {
            $data->max_participants = $request->max_participants;
        }

        if ($request->price !== $data->price) {
            $data->price = $request->price;
        }

        if ($request->split_price_by_participants !== $data->split_price_by_participants) {
            $data->split_price_by_participants = $request->split_price_by_participants;
        }

        if ($request->start_at !== $data->start_at) {
            $data->start_at = $request->start_at;
        }

        if ($request->finishes_at !== $data->finishes_at) {
            $data->finishes_at = $request->finishes_at;
        }

        if ($request->location !== $data->location) {
            $data->location = $request->location;
        }

        if ($request->sport_id !== $data->sport_id) {
            $data->sport_id = $request->sport_id;
            $data->load('sport');
        }

        $data->save();

        return response()->json([
            "status" => "success",
            "message" => "Evento editado com sucesso!",
            "data" => $data
        ]);
    }

    public function dashboardDestroy(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Event::with(['sport'])
            ->where('user_id', $userId)
            ->where('id', $id)
            ->firstOrFail();

        $data->delete();

        return response()->json([
            "status" => "success",
            "message" => "Evento excluído com sucesso!",
            "data" => $data
        ]);
    }

    public function dashboardParticipantsIndex(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Participant::with(['user'])
            ->where('event_id', $id)
            ->whereHas('event', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->get();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function dashboardParticipantsUpdate(Request $request, $id, $participantId)
    {
        $user = $request->user();
        $userId = $user->id;

        $request->validate([
            'is_paid' => 'required|boolean',
        ]);

        $data = Participant::where('id', $participantId)
            ->where('event_id', $id)
            ->whereHas('event', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->first();

        if ($request->is_paid !== $data->is_paid) {
            $data->is_paid = $request->is_paid;
        }

        $data->save();

        return response()->json([
            "status" => "success",
            "message" => "Participante editado com sucesso!",
            "data" => $data
        ]);
    }

    public function dashboardParticipantsDestroy(Request $request, $id, $participantId)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Participant::where('id', $participantId)
            ->where('event_id', $id)
            ->whereHas('event', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->first();

        if ($data->user_id === $userId) {
            throw new \Exception("Por ser o dono não pode se excluir do evento.");
        } else {
            $data->delete();
        }

        return response()->json([
            "status" => "success",
            "message" => "Participante excluído com sucesso!",
            "data" => $data
        ]);
    }

    public function join(Request $request, $id)
    {
        $user = $request->user();
        $event = Event::withCount('participants')->findOrFail($id);

        if ($event->isActive()) {

            if (
                !is_null($event->max_participants) &&
                $event->max_participants > 0 &&
                $event->participants_count + 1 > $event->max_participants
            ) {
                throw new \Exception("Máximo de participantes já foi atingido.");
            }

            $verification = Participant::withTrashed()
                ->where('user_id', $user->id)
                ->where('event_id', $id)
                ->first();

            if ($verification) {
                $verification->restore();
                $data = $verification;
            } else {
                $data = Participant::create([
                    'user_id' => $user->id,
                    'event_id' => $id
                ]);
            }
        } else {
            throw new \Exception("Evento expirado.");
        }

        return response()->json([
            "status" => "success",
            "message" => "Participação criada com sucesso!",
            "data" => $data
        ]);
    }

    public function leave(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Participant::with('event')
            ->where('event_id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($data->event->user_id === $userId) {
            throw new \Exception("Por ser o dono não pode se excluir do evento.");
        } else {
            $data->delete();
        }

        return response()->json([
            "status" => "success",
            "message" => "Participação removida com sucesso!",
            "data" => $data
        ]);
    }

    public function participatingIndex(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Event::with(['sport'])
        ->withCount('participants')
        ->whereHas('participants', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->where('user_id', '!=', $userId)
        ->get();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function commentsIndex(Request $request, $id)
    {
        $data = Comment::with(['user', 'answers', 'answers.user'])->where('event_id', $id)->get();

        return response()->json([
            "status" => "success",
            "data" => $data,
        ]);
    }

    public function commentsStore(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $request->validate([
            'value' => 'required|string',
        ]);

        $data = Comment::create([
            'value' => $request->value,
            'user_id' => $userId,
            'event_id' => $id,
        ]);

        $data->load('user');

        broadcast(new EventComment($data));

        return response()->json([
            "status" => "success",
            "data" => $data,
            "message" => "Comentário enviado com sucesso."
        ]);
    }

    public function commentsAnswersStore(Request $request, $id, $commentId)
    {
        $user = $request->user();
        $userId = $user->id;

        $request->validate([
            'value' => 'required|string',
        ]);

        $data = CommentAnswer::create([
            'value' => $request->value,
            'user_id' => $userId,
            'comment_id' => $commentId,
        ]);

        $data->load(['user', 'comment']);

        broadcast(new EventCommentAnswer($data));

        return response()->json([
            "status" => "success",
            "data" => $data,
            "message" => "Resposta enviada com sucesso."
        ]);
    }

    public function galleryImagesIndex(Request $request, $id)
    {
        $data = Event::select(['id', 'image_paths'])->where('id', $id)->firstOrFail();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function dashboardGalleryImagesIndex(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Event::where('user_id', $userId)->select(['id', 'image_paths'])->where('id', $id)->firstOrFail();

        return response()->json([
            "status" => "success",
            "data" => $data
        ]);
    }

    public function dashboardGalleryImagesStore(Request $request, $id)
    {
        $user = $request->user();
        $userId = $user->id;

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = Event::where('user_id', $userId)->select(['id', 'image_paths'])->where('id', $id)->firstOrFail();

        $dataImagePaths = $data->image_paths ?? [];

        if (count($dataImagePaths) === 15) {
            throw new \Exception ('Limite máximo de 15 imagens atingido.');
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('imgs/events/gallery', 'public');
            $dataImagePaths[] = $imagePath;
        }

        $data->image_paths = $dataImagePaths;
        $data->save();

        return response()->json([
            "status" => "success",
            "message" => "Imagem de galeria de evento adicionada com sucesso",
            "data" => $data
        ]);
    }

    public function dashboardGalleryImagesDelete(Request $request, $id, $imageIndex)
    {
        $user = $request->user();
        $userId = $user->id;

        $data = Event::where('user_id', $userId)->select(['id', 'image_paths'])->where('id', $id)->firstOrFail();

        $dataImagePaths = $data->image_paths;

        if (!isset($dataImagePaths[$imageIndex])) {
            throw new \Exception ("Imagem não encontrada");
        }

        $imagePath = $dataImagePaths[$imageIndex];

        Storage::disk('public')->delete($imagePath);
        array_splice($dataImagePaths, $imageIndex, 1);

        $data->image_paths = $dataImagePaths;
        $data->save();

        return response()->json([
            "status" => "success",
            "message" => "Imagem de galeria de evento excluída com sucesso",
            "data" => $data
        ]);
    }
}
