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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pesanan_perbaikan_id');
            $table->uuid('user_id');
            $table->decimal('jumlah_bayar', 10, 2);
            $table->enum('metode_pembayaran', ['transfer', 'cash', 'credit_card']);
            $table->enum('status_pembayaran', ['pending', 'lunas', 'gagal'])->default('pending');
            $table->timestamp('tanggal_pembayaran')->nullable();
            $table->timestamps();

            $table->foreign('pesanan_perbaikan_id')->references('id')->on('pesanan__perbaikans')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
