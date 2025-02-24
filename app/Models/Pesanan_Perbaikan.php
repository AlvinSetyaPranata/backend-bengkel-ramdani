<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pesanan_Perbaikan extends Model
{
    /** @use HasFactory<\Database\Factories\PesananPerbaikanFactory> */
    use HasFactory,HasUuids;

    protected $fillable = [
        'kendaraan_pelanggar_id',
        'tanggal_masuk',
        'tanggal_perbaikan',
        'tanggal_selesai',
        'total_biaya',
        'status',
    ];

    public function kendaraan(): BelongsTo
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_pelanggan_id', 'id');
    }

}
