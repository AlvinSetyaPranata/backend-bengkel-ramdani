<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request)
    {
        try {
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

            return $this->successResponse($admin, 'Pendaftaran berhasil', 201);
        } catch (ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mendaftarkan admin', null, 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $admin = Admin::where('email', $request->email)->first();

            if (!$admin || !Hash::check($request->password, $admin->password)) {
                return $this->errorResponse('Kredensial yang diberikan salah', null, 401);
            }

            $token = $admin->createToken('auth_token')->plainTextToken;

            return $this->successResponse([
                'admin' => $admin,
                'token' => $token
            ], 'Masuk berhasil');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal masuk', null, 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->successResponse(null, 'Keluar berhasil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal keluar', null, 500);
        }
    }

    public function profile(Request $request)
    {
        try {
            return $this->successResponse($request->user());
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil profil', null, 500);
        }
    }

    public function listAdmins()
    {
        try {
            $admins = Admin::where('role', 'admin')->get();
            return $this->successResponse($admins, 'Daftar admin berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil daftar admin', null, 500);
        }
    }

    public function deleteAdmin(Admin $admin)
    {
        try {
            if ($admin->isSuperAdmin()) {
                return $this->errorResponse('Tidak dapat menghapus admin super', null, 403);
            }

            $admin->delete();
            return $this->successResponse(null, 'Admin berhasil dihapus');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menghapus admin', null, 500);
        }
    }

    public function listUsers()
    {
        try {
            $users = User::paginate(10);
            return $this->paginationResponse($users, 'Daftar pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil daftar pengguna', null, 500);
        }
    }

    public function getUser($id)
    {
        try {
            $user = User::findOrFail($id);
            return $this->successResponse($user, 'Data pengguna berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Pengguna tidak ditemukan', null, 404);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $request->validate([
                'name' => 'nullable|string|max:255',
                'email' => 'nullable|email|unique:users,email,' . $user->id,
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'nullable|in:active,inactive'
            ]);

            if ($request->hasFile('avatar')) {
                if ($user->avatar) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }
    
            $user->fill($request->only(['name', 'email', 'status']));
            $user->save();
            
            return $this->successResponse($user, 'Data pengguna berhasil diperbarui');
        } catch (ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal memperbarui data pengguna', null, 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return $this->successResponse(null, 'Pengguna berhasil dihapus');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menghapus pengguna', null, 500);
        }
    }

    public function searchUsers(Request $request)
    {
        try {
            $query = User::query();

            $searchFields = ['name', 'email', 'status'];
            foreach ($searchFields as $field) {
                if ($request->has($field)) {
                    $query->where($field, 'like', '%' . $request->input($field) . '%');
                }
            }

            $users = $query->paginate(10);
            return $this->paginationResponse($users, 'Pencarian pengguna berhasil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mencari pengguna', null, 500);
        }
    }
}