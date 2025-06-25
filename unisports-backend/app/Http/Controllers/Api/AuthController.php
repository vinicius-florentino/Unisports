<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\PasswordResetToken;
use App\Models\VerifyEmailToken;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        if ($request->filled('phone')) {
            $request->merge(['phone' => preg_replace('/\D/', '', $request->phone)]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|unique:users|min:12|max:13',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => "success",
            'message' => "Cadastro realizado com sucesso!",
            'data' => [
                'user' => $user,
                'token' => $user->createToken('Personal Access Token')->plainTextToken
            ]
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw new \Exception('Senha e/ou email incorretos!');
        }

        $user = Auth::user();

        return response()->json([
            'status' => "success",
            'message' => "Sessão iniciada com sucesso!",
            'data' => [
                'user' => $user,
                'token' => $user->createToken('Personal Access Token')->plainTextToken
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => "Sessão finalizada com sucesso!"
        ]);
    }

    public function sendResetPasswordLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();
        $passwordReset = PasswordResetToken::where('user_email', $user?->email)->first();

        if ($user && (!$passwordReset || Carbon::parse($passwordReset->expires_at)->isPast())) {

            try {
                DB::beginTransaction();

                do {
                    $token = Str::random(60);
                } while (PasswordResetToken::where('token', $token)->exists());

                $expiration = Carbon::now()->addHours(2);

                if ($passwordReset) {
                    $passwordReset->token = $token;
                    $passwordReset->expires_at = $expiration;
                    $passwordReset->save();
                } else {
                    PasswordResetToken::create([
                        'user_email' => $user->email,
                        'token' => $token,
                        'expires_at' => $expiration,
                    ]);
                }

                $resetLink = env("FRONTEND_BASE_URL") . '/password/reset?token=' . $token;

                Mail::send('mails.password_reset', ['link' => $resetLink], function ($message) use ($user) {
                    $message->to($user->email);
                    $message->subject(env("APP_NAME") . " - " . 'Recuperação de Senha');
                });

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => "Foi enviado um link de redefinicão de senha para o email inserido, verifique sua caixa de entrada."
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        try {
            DB::beginTransaction();

            $passwordResetToken = PasswordResetToken::where('token', $request->token)->firstOrFail();

            if (!$passwordResetToken || Carbon::parse($passwordResetToken->expires_at)->isPast()) {
                throw new \Exception("Token inválido ou expirado.");
            }

            $user = User::where('email', $passwordResetToken->user_email)->firstOrFail();
            $user->password = Hash::make($request->password);
            $user->save();

            $passwordResetToken->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            'status' => 'success',
            'message' => "Senha redefinida com sucesso!"
        ]);
    }

    public function sendVerifyEmailLink(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            throw new \Exception("Email já foi verificado.");
        }

        $verifyEmailToken = VerifyEmailToken::where('user_id', $user?->id)->first();

        if (!$verifyEmailToken || Carbon::parse($verifyEmailToken->expires_at)->isPast()) {

            try {
                DB::beginTransaction();

                do {
                    $token = Str::random(60);
                } while (VerifyEmailToken::where('token', $token)->exists());

                $expiration = Carbon::now()->addDay();

                if ($verifyEmailToken) {
                    $verifyEmailToken->token = $token;
                    $verifyEmailToken->expires_at = $expiration;
                    $verifyEmailToken->save();
                } else {
                    VerifyEmailToken::create([
                        'user_id' => $user->id,
                        'token' => $token,
                        'expires_at' => $expiration,
                    ]);
                }

                $link = env("FRONTEND_BASE_URL") . '/email/verify?token=' . $token;

                Mail::send('mails.verify_email', ['link' => $link], function ($message) use ($user) {
                    $message->to($user->email);
                    $message->subject(env("APP_NAME") . " - " . 'Verificação de Email');
                });

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => "Foi enviado um link de confirmação para o email inserido, verifique sua caixa de entrada."
        ]);
    }

    public function verifyEmail(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $verifyEmailToken = VerifyEmailToken::where('token', $request->token)->first();

            if (!$verifyEmailToken || Carbon::parse($verifyEmailToken->expires_at)->isPast()) {
                throw new \Exception("Token inválido ou expirado.");
            }

            if (!$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
            }

            $verifyEmailToken->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            'status' => 'success',
            'message' => "Email verificado com sucesso!",
            'data' => $user
        ]);
    }
}
