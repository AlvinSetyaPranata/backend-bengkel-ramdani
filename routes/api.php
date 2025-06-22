<?php

use App\Http\Controllers\Api\Auth\UserAuthController;
use App\Http\Controllers\Api\Auth\AdminAuthController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\MidtransController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PesananPerbaikanController;
use Illuminate\Support\Facades\Route;



 Route::post('midtrans/callback', [MidtransController::class, "NotificationCallback"]);

Route::prefix('user')->group(function () {
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);
    
    Route::middleware(['auth:sanctum', 'user.type:user'])->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout']);
        Route::get('profile', [UserAuthController::class, 'profile']);
        Route::post('profile-update', [UserAuthController::class, 'updateProfile']);
        
        // Rute kendaraan untuk pengguna
        Route::get('kendaraan', [KendaraanController::class, 'index']);
        Route::get('kendaraan/{id}', [KendaraanController::class, 'show']);
        
        // Rute pesanan perbaikan untuk pengguna
        Route::get('pesanan', [PesananPerbaikanController::class, 'getPerbaikanUser']);
        Route::get('pesanan/{id}', [PesananPerbaikanController::class, 'show']);
        Route::post('pesanan/{id}/cancel', [PesananPerbaikanController::class, 'cancelOrder']);
        Route::get('kendaraan/{kendaraanId}/pesanan', [PesananPerbaikanController::class, 'getPerbaikanKendaraan']);

        // Route manajemn pembayaran
        Route::post('pembayaran/{paymentId}', [PembayaranController::class, 'bayar']);
        Route::get('pembayaran/{paymentId}', [PembayaranController::class, 'getPaymentsById']);

    });
});

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    
    Route::middleware(['auth:sanctum', 'super_admin'])->group(function () {
        Route::post('register', [AdminAuthController::class, 'register']);
        Route::get('list', [AdminAuthController::class, 'listAdmins']);
        Route::delete('{admin}', [AdminAuthController::class, 'deleteAdmin']);
    });
    Route::middleware(['auth:sanctum', 'user.type:admin'])->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);
        Route::get('profile', [AdminAuthController::class, 'profile']);

        Route::prefix('auth-user')->group(function () {
            Route::post('register', [UserAuthController::class, 'register']);
            Route::post('login', [UserAuthController::class, 'login']);
        });
        
        // Rute manajemen pengguna
        Route::get('users', [AdminAuthController::class, 'listUsers']);
        Route::get('users/search', [AdminAuthController::class, 'searchUsers']);
        Route::get('users/{id}', [AdminAuthController::class, 'getUser']);
        Route::post('users/{id}', [AdminAuthController::class, 'updateUser']);
        Route::delete('users/{id}', [AdminAuthController::class, 'deleteUser']);

        // Rute manajemen kendaraan
        Route::get('kendaraan', [KendaraanController::class, 'index']);
        Route::get('kendaraan/{id}', [KendaraanController::class, 'show']);
        Route::post('kendaraan', [KendaraanController::class, 'store']);
        Route::post('kendaraan/{id}', [KendaraanController::class, 'update']);
        Route::delete('kendaraan/{id}', [KendaraanController::class, 'destroy']);

         // Rute manajemen pesanan perbaikan
        Route::get('pesanan', [PesananPerbaikanController::class, 'index']);
        Route::get('pesanan/statistics', [PesananPerbaikanController::class, 'getStatisticsPerbaikan']);
        Route::get('pesanan/user/{userId?}', [PesananPerbaikanController::class, 'getPerbaikanUser']);
        Route::get('pesanan/kendaraan/{kendaraanId}', [PesananPerbaikanController::class, 'getPerbaikanKendaraan']);
        Route::get('pesanan/{id}', [PesananPerbaikanController::class, 'show']);
        Route::post('pesanan', [PesananPerbaikanController::class, 'store']);
        Route::put('pesanan/{id}', [PesananPerbaikanController::class, 'update']);
        Route::delete('pesanan/{id}', [PesananPerbaikanController::class, 'destroy']);

        
    });
});