<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pembayaran extends Model
{
    /** @use HasFactory<\Database\Factories\PembayaranFactory> */
    use HasFactory,HasUuids;

    protected $fillable = [
        'pesanan_perbaikan_id',
        'user_id',
        'jumlah_bayar',
        'metode_pembayaran',
        'status_pembayaran',
        'tanggal_pembayaran'
    ];

    public function pesananPerbaikan(): BelongsTo
    {
        return $this->belongsTo(Pesanan_Perbaikan::class, 'pesanan_perbaikan_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
