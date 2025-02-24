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
        Schema::create('metode__pembayarans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama', 50); // Transfer Bank, E-Wallet, dll.
            $table->string('kode', 20)->unique(); // BCA, OVO, VISA, dll.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metode__pembayarans');
    }
};
