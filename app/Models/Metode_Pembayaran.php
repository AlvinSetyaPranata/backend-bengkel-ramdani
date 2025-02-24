<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Metode_Pembayaran extends Model
{
    /** @use HasFactory<\Database\Factories\MetodePembayaranFactory> */
    use HasFactory,HasUuids;

    protected $fillable = ['nama', 'kode'];
}
