<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        if ($request->filled('phone')) {
            $request->merge(['phone' => preg_replace('/\D/', '', $request->phone)]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'phone' => [
                'nullable',
                'string',
                'min:12',
                'max:13',
                Rule::unique('users')->ignore($user->id), 
            ],
        ]);

        if ($request->name !== $user->name) {
            $user->name = $request->name;
        }
        
        if ($request->email !== $user->email) {
            $user->email = $request->email;
        }
        
        if ($request->phone !== $user->phone) {
            $user->phone = $request->phone;
        }
        
        $user->save();

        return response()->json([
            "status" => "success",
            "message" => "Informações atualizadas com sucesso",
            "data" => $user
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => [
                'required',
                function ($attr, $value, $fail) use ($user) {
                    if (!Hash::check($value, $user->password)) {
                        $fail('A senha atual está incorreta.');
                    }
                }
            ],
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 'success',
            "message" => "Senha atualizada com sucesso"
        ]);
    }

    public function updateImage(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($request->hasFile('image')) {

            if ($user->image_path && Storage::disk('public')->exists($user->image_path)) {
                Storage::disk('public')->delete($user->image_path);
            }
    
            $imagePath = $request->file('image')->store('imgs/users', 'public');
            $user->image_path = $imagePath;
        }

        $user->save();

        return response()->json([
            "status" => "success",
            "message" => "Imagem atualizada com sucesso",
            "data" => $user
        ]);
    }

    public function destroyImage(Request $request)
    {
        $user = $request->user();

        Storage::disk('public')->delete($user->image_path);

        $user->image_path = null;
        $user->save();

        return response()->json([
            "status" => "success",
            "message" => "Imagem excluída com sucesso",
            "data" => $user
        ]);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password' => [
                'required',
                function ($attr, $value, $fail) use ($user) {
                    if (!Hash::check($value, $user->password)) {
                        $fail('A senha atual está incorreta.');
                    }
                }
            ],
        ]);

        try {
            DB::beginTransaction();
            $user->tokens()->delete();
            $user->delete();
    
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            "status" => "success",
            "message" => "Conta excluída com sucesso"
        ]);
    }
}
