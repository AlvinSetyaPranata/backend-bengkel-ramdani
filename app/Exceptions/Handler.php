<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return $this->handleApiException($e, $request);
            }
        });
    }

    private function handleApiException(Throwable $e, $request)
    {
        if ($e instanceof AuthenticationException) {
            return response()->json([
                'pesan' => 'Tidak terautentikasi',
                'error' => 'Silakan login terlebih dahulu'
            ], 401);
        }

        if ($e instanceof ValidationException) {
            return response()->json([
                'pesan' => 'Validasi gagal',
                'error' => $e->validator->errors()
            ], 422);
        }

        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'pesan' => 'Data tidak ditemukan',
                'error' => 'Data yang diminta tidak ada'
            ], 404);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->json([
                'pesan' => 'Route tidak ditemukan',
                'error' => 'URL yang diminta tidak ditemukan'
            ], 404);
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            return response()->json([
                'pesan' => 'Metode tidak diizinkan',
                'error' => 'Metode HTTP tidak didukung untuk route ini'
            ], 405);
        }

        if ($e instanceof AuthorizationException || $e instanceof AccessDeniedHttpException) {
            return response()->json([
                'pesan' => 'Akses ditolak',
                'error' => 'Anda tidak memiliki izin untuk mengakses resource ini'
            ], 403);
        }

        if ($e instanceof QueryException) {
            logger()->error($e->getMessage());
            
            return response()->json([
                'pesan' => 'Error database',
                'error' => 'Terjadi kesalahan saat memproses permintaan Anda'
            ], 500);
        }

        if (config('app.debug')) {
            return response()->json([
                'pesan' => 'Error Server',
                'error' => $e->getMessage(),
                'trace' => $e->getTrace()
            ], 500);
        }

        return response()->json([
            'pesan' => 'Error Server',
            'error' => 'Terjadi kesalahan yang tidak diharapkan'
        ], 500);
    }
}