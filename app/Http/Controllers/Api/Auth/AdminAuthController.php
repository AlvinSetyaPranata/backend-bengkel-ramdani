<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8',
        ]);

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        return response()->json([
            'message' => 'Pendaftaran berhasil',
            'admin' => $admin,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan salah.'],
            ]);
        }

        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Masuk berhasil',
            'admin' => $admin,
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

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function listAdmins()
    {
        return response()->json(Admin::where('role', 'admin')->get());
    }

    public function deleteAdmin(Admin $admin)
    {
        if ($admin->isSuperAdmin()) {
            return response()->json(['message' => 'Tidak dapat menghapus admin super'], 403);
        }

        $admin->delete();
        return response()->json(['message' => 'Admin berhasil dihapus']);
    }

    public function listUsers()
    {
        try {
            $users = User::all();
            return response()->json([
                'status' => 'semua pengguna berhasil didapatkan',
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil daftar pengguna',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUser($id)
    {
        try {
            $user = User::findOrFail($id);
            
            $userData = $user->toArray();
            if ($userData['avatar']) {
                $userData['avatar'] = url('storage/' . $userData['avatar']);
            }

            return response()->json([
                'status' => 'success',
                'user' => $userData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Pengguna tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:users,email,' . $user->id,
                'plat_nomor' => 'nullable|string|max:15',
                'status' => 'nullable|in:active,inactive'
            ]);

            if ($request->filled('name')) {
                $user->name = $request->name;
            }
            if ($request->filled('email')) {
                $user->email = $request->email;
            }
            if ($request->filled('plat_nomor')) {
                $user->plat_nomor = $request->plat_nomor;
            }
            if ($request->filled('status')) {
                $user->status = $request->status;
            }

            $user->save();

            return response()->json([
                'message' => 'Data pengguna berhasil diperbarui',
                'user' => $user
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui data pengguna',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            $user->delete();

            return response()->json([
                'message' => 'Pengguna berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus pengguna',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function searchUsers(Request $request)
    {
        try {
            $query = User::query();

            if ($request->has('name')) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }
            if ($request->has('email')) {
                $query->where('email', 'like', '%' . $request->email . '%');
            }
            if ($request->has('plat_nomor')) {
                $query->where('plat_nomor', 'like', '%' . $request->plat_nomor . '%');
            }
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $users = $query->get();

            return response()->json([
                'status' => 'success',
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mencari pengguna',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
