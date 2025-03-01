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
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // Tambahkan kode untuk melaporkan error ke log atau monitoring service
        });

        $this->renderable(function (Throwable $e, $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return $this->handleApiException($e, $request);
            }
        });
    }

    /**
     * Handle API exceptions and return standardized JSON response.
     *
     * @param Throwable $e
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    private function handleApiException(Throwable $e, $request)
    {
        // Format respons yang konsisten
        $response = [
            'success' => false,
            'pesan' => 'Error Server',
            'error' => null,
            'data' => null
        ];

        // Handle berbagai tipe exception
        if ($e instanceof AuthenticationException) {
            $response['pesan'] = 'Tidak terautentikasi';
            $response['error'] = 'Silakan login terlebih dahulu';
            return response()->json($response, 401);
        }

        if ($e instanceof ValidationException) {
            $response['pesan'] = 'Validasi gagal';
            $response['error'] = $e->validator->errors();
            return response()->json($response, 422);
        }

        if ($e instanceof ModelNotFoundException) {
            $model = strtolower(class_basename($e->getModel()));
            $response['pesan'] = 'Data tidak ditemukan';
            $response['error'] = "Data {$model} yang diminta tidak ada";
            return response()->json($response, 404);
        }

        if ($e instanceof NotFoundHttpException) {
            $response['pesan'] = 'Route tidak ditemukan';
            $response['error'] = 'URL yang diminta tidak ditemukan';
            return response()->json($response, 404);
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            $response['pesan'] = 'Metode tidak diizinkan';
            $response['error'] = 'Metode HTTP tidak didukung untuk route ini';
            return response()->json($response, 405);
        }

        if ($e instanceof AuthorizationException || $e instanceof AccessDeniedHttpException) {
            $response['pesan'] = 'Akses ditolak';
            $response['error'] = 'Anda tidak memiliki izin untuk mengakses resource ini';
            return response()->json($response, 403);
        }

        if ($e instanceof ThrottleRequestsException) {
            $response['pesan'] = 'Terlalu banyak permintaan';
            $response['error'] = 'Anda telah mencapai batas permintaan. Silakan coba lagi nanti.';
            return response()->json($response, 429);
        }

        if ($e instanceof TokenMismatchException) {
            $response['pesan'] = 'Token tidak valid';
            $response['error'] = 'CSRF token tidak valid atau kedaluwarsa. Silakan refresh halaman.';
            return response()->json($response, 419);
        }

        if ($e instanceof FileNotFoundException) {
            $response['pesan'] = 'File tidak ditemukan';
            $response['error'] = 'File yang diminta tidak ditemukan';
            return response()->json($response, 404);
        }

        if ($e instanceof QueryException) {
            logger()->error('Database Error: ' . $e->getMessage());
            
            // Deteksi foreign key constraint errors
            if (str_contains($e->getMessage(), 'foreign key constraint fails')) {
                $response['pesan'] = 'Referensi data tidak valid';
                $response['error'] = 'Data yang direferensikan tidak ada atau sedang digunakan';
                return response()->json($response, 409);
            }
            
            // Deteksi duplicate entry errors
            if (str_contains($e->getMessage(), 'Duplicate entry')) {
                $response['pesan'] = 'Data duplikat';
                $response['error'] = 'Data yang sama sudah ada';
                return response()->json($response, 409);
            }
            
            $response['pesan'] = 'Error database';
            $response['error'] = 'Terjadi kesalahan saat memproses permintaan Anda';
            return response()->json($response, 500);
        }

        if ($e instanceof HttpException) {
            $statusCode = $e->getStatusCode();
            $response['pesan'] = $this->getHttpExceptionMessage($statusCode);
            $response['error'] = $e->getMessage() ?: $this->getHttpExceptionMessage($statusCode);
            return response()->json($response, $statusCode);
        }

        // Untuk exception lain yang tidak ditangani secara khusus
        logger()->error('Unhandled Exception: ' . $e->getMessage());
        
        if (config('app.debug')) {
            $response['pesan'] = 'Error Server';
            $response['error'] = $e->getMessage();
            $response['exception_class'] = get_class($e);
            $response['trace'] = $e->getTrace();
            $response['file'] = $e->getFile();
            $response['line'] = $e->getLine();
            return response()->json($response, 500);
        }

        $response['pesan'] = 'Error Server';
        $response['error'] = 'Terjadi kesalahan yang tidak diharapkan';
        return response()->json($response, 500);
    }

    /**
     * Get a human-readable message for HTTP status codes.
     *
     * @param int $statusCode
     * @return string
     */
    private function getHttpExceptionMessage(int $statusCode): string
    {
        $messages = [
            400 => 'Bad Request',
            401 => 'Tidak Terautentikasi',
            403 => 'Akses Ditolak',
            404 => 'Tidak Ditemukan',
            405 => 'Metode Tidak Diizinkan',
            408 => 'Request Timeout',
            409 => 'Konflik Data',
            419 => 'Page Expired',
            422 => 'Unprocessable Entity',
            429 => 'Terlalu Banyak Permintaan',
            500 => 'Error Server',
            503 => 'Layanan Tidak Tersedia',
        ];

        return $messages[$statusCode] ?? 'HTTP Error ' . $statusCode;
    }
}