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
            $table->string('payment_link')->nullable();
            $table->string('status_pembayaran')->nullable();
            $table->string('metode_pembayaran');
            $table->decimal('jumlah_dibayar', 12, 2)->nullable();
            $table->timestamp('tanggal_pembayaran')->nullable();
            $table->foreign('pesanan_perbaikan_id')->references('id')->on('pesanan__perbaikans')->onDelete('cascade');
            $table->timestamps();
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
