<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kendaraan extends Model
{
    /** @use HasFactory<\Database\Factories\KendaraanFactory> */
    use HasFactory,  HasUuids;

    protected $fillable = [
        'user_id',
        'nama_kendaraan',
        'plat_nomor',
        'gambar_kendaraan',
        'tahun_produksi',
        'warna',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function getGambarKendaraanAttribute($value)
    {
        return $value ? asset('storage/' . $value) : null;
    }
}
