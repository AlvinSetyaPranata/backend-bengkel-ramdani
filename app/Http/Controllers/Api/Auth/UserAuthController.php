<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Pendaftaran berhasil',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Masuk berhasil',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Keluar berhasil'
        ]);
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'nullable|string|max:255',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'plat_nomor' => 'nullable|string|max:15',
            ]);

            $user = Auth::user();

            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            if ($request->hasFile('avatar')) {
                try {
                    if ($user->avatar) {
                        Storage::disk('public')->delete($user->avatar);
                    }

                    $avatarPath = $request->file('avatar')->store('avatars', 'public');
                    $user->avatar = $avatarPath;
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'Gagal mengunggah avatar',
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            if ($request->filled('name')) {
                $user->name = $request->name;
            }

            if ($request->filled('plat_nomor')) {
                $user->plat_nomor = $request->plat_nomor;
            }

            $user->save();

            $userData = $user->toArray();
            if ($userData['avatar']) {
                $userData['avatar'] = url('storage/' . $userData['avatar']);
            }

            return response()->json([
                'message' => 'Profil berhasil diperbarui',
                'user' => $userData,
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function profile(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $userData = $user->toArray();
            
            if ($userData['avatar']) {
                $userData['avatar'] = url('storage/' . $userData['avatar']);
            }
            
            return response()->json([
                'status' => 'berhasil mendapatkan profil',
                'user' => $userData
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil profil',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}