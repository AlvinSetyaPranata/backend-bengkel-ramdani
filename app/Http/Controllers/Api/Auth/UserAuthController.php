<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // Hash password
            ]);

            return $this->successResponse([
                'user' => $user,
            ], 'Pendaftaran berhasil', 201);

        } catch (ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal melakukan pendaftaran', null, 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $request->email)->first();

            

            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->errorResponse('Kredensial yang diberikan salah', null, 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'user' => $user,
                'token' => $token
            ], 'Masuk berhasil');

        } catch (ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        }
        // catch (\Exception $e) {
        //     return $this->errorResponse('Gagal melakukan login', null, 500);
        // }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->successResponse(null, 'Keluar berhasil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal melakukan logout', null, 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'nullable|string|max:255',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'nullable|in:active,inactive'
            ]);

            $user = Auth::user();

            if (!$user) {
                return $this->errorResponse('Tidak terautentikasi', null, 401);
            }

            if ($request->hasFile('avatar')) {
                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }

            $user->fill($request->only(['name', 'status']));
            $user->save();

            $userData = $user->toArray();

            return $this->successResponse($userData, 'Profil berhasil diperbarui');

        } catch (ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal memperbarui profil', null, 500);
        }
    }

    public function profile(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return $this->errorResponse('Tidak terautentikasi', null, 401);
            }

            return $this->successResponse($user, 'Berhasil mendapatkan profil');

        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil profil', null, 500);
        }
    }
}