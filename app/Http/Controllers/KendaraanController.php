<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class KendaraanController extends Controller
{
    use ApiResponse;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $kendaraans = Kendaraan::with(['user:id,name'])
                ->select('id', 'user_id', 'nama_kendaraan', 'plat_nomor', 'tahun_produksi', 'warna', 'gambar_kendaraan')
                ->paginate(10);
    
            $kendaraans->getCollection()->transform(function ($kendaraan) use ($user) {
                $kendaraan->is_owner = $kendaraan->user_id === $user->id;
                return $kendaraan;
            });
    
            return $this->paginationResponse($kendaraans, 'Daftar kendaraan berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil daftar kendaraan', $e->getMessage(), 500);
        }
    }
    
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|uuid|exists:users,id',
                'nama_kendaraan' => 'required|string|max:255',
                'plat_nomor' => 'required|string|max:20|unique:kendaraans',
                'tahun_produksi' => 'nullable|date_format:Y',
                'warna' => 'nullable|string|max:50',
                'gambar_kendaraan' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            $data = $request->all();
            $data['id'] = Str::uuid();
            
            // Menangani unggahan gambar
            if ($request->hasFile('gambar_kendaraan')) {
                $file = $request->file('gambar_kendaraan');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('kendaraan', $fileName, 'public');
                $data['gambar_kendaraan'] = $path;
            }
            
            $kendaraan = Kendaraan::create($data);
            
            return $this->successResponse($kendaraan, 'Kendaraan berhasil ditambahkan', 201);
        } catch(ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch(\Exception $e) {
            return $this->errorResponse('Gagal menambahkan kendaraan', null, 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
{
    try {
        $kendaraan = Kendaraan::with(['user:id,name,email'])->findOrFail($id);
        
        if (Auth::guard('sanctum')->check() && Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
            if (Auth::id() !== $kendaraan->user_id) {
                return $this->errorResponse('Tidak diizinkan untuk melihat informasi kendaraan detail', null, 403);
            }
        }
        
        return $this->successResponse($kendaraan, 'Detail kendaraan berhasil diambil');
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return $this->errorResponse('Kendaraan tidak ditemukan', "ID kendaraan tidak valid: {$id}", 404);
    } catch (\Exception $e) {
        return $this->errorResponse('Gagal mengambil detail kendaraan', $e->getMessage(), 500);
    }
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kendaraan $kendaraan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $kendaraan = Kendaraan::findOrFail($id);
            
            $request->validate([
                'user_id' => 'sometimes|required|uuid|exists:users,id',
                'nama_kendaraan' => 'sometimes|required|string|max:255',
                'plat_nomor' => 'sometimes|required|string|max:20|unique:kendaraans,plat_nomor,' . $id,
                'tahun_produksi' => 'nullable|date_format:Y',
                'warna' => 'nullable|string|max:50',
                'gambar_kendaraan' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);
            
            $data = $request->all();
            
            // Menangani unggahan gambar
            if ($request->hasFile('gambar_kendaraan')) {
                // Hapus gambar lama jika ada
                if ($kendaraan->gambar_kendaraan) {
                    Storage::disk('public')->delete($kendaraan->getRawOriginal('gambar_kendaraan'));
                }
                
                $file = $request->file('gambar_kendaraan');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('kendaraan', $fileName, 'public');
                $data['gambar_kendaraan'] = $path;
            }
            $kendaraan->update($data);
            
            return $this->successResponse($kendaraan, 'Kendaraan berhasil diperbarui');
        } catch(ValidationException $e) {
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch(\Exception $e) {
            return $this->errorResponse('Gagal mengupdate kendaraan', null, 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $kendaraan = Kendaraan::findOrFail($id);
            
            // Hapus gambar jika ada
            if ($kendaraan->gambar_kendaraan) {
                Storage::disk('public')->delete($kendaraan->getRawOriginal('gambar_kendaraan'));
            }
            
            $kendaraan->delete();
            
            return $this->successResponse(null, 'Kendaraan berhasil dihapus');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal menghapus kendaraan', null, 500);
        }
    }

}
