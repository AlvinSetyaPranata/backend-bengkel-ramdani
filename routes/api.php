<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\Auth\UserAuthController;
use App\Http\Controllers\Api\Auth\AdminAuthController;
use App\Http\Controllers\Api\LabelController;
use Illuminate\Support\Facades\Route;


Route::prefix('user')->group(function () {
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);
    
    Route::middleware(['auth:sanctum', 'user.type:user'])->group(function () {
        Route::post('logout', [UserAuthController::class, 'logout']);
        Route::get('profile', [UserAuthController::class, 'profile']);
        Route::post('profile-update', [UserAuthController::class, 'updateProfile']); 
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

        // Rute manajemen pengguna
        Route::get('users', [AdminAuthController::class, 'listUsers']);
        Route::get('users/search', [AdminAuthController::class, 'searchUsers']);
        Route::get('users/{id}', [AdminAuthController::class, 'getUser']);
        Route::put('users/{id}', [AdminAuthController::class, 'updateUser']);
        Route::delete('users/{id}', [AdminAuthController::class, 'deleteUser']);
    });
});