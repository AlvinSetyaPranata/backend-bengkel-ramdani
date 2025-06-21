<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pesanan__perbaikans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('kendaraan_pelanggan_id'); 
            $table->date('tanggal_masuk');
            $table->date('tanggal_perbaikan');
            $table->date('tanggal_selesai');
            $table->decimal('total_biaya', 12, 2);
            $table->string('keterangan');
            $table->enum('status', ['menunggu', 'proses', 'selesai', 'batal'])->default('menunggu');
            $table->timestamps();

            $table->foreign('kendaraan_pelanggan_id')->references('id')->on('kendaraans')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pesanan__perbaikans');
    }
};
