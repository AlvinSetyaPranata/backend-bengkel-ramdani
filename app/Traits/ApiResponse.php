<?php

namespace App\Traits;

trait ApiResponse
{
    protected function successResponse($data, $pesan = null, $code = 200)
    {
        return response()->json([
            'status' => 'sukses',
            'pesan' => $pesan,
            'data' => $data
        ], $code);
    }

    protected function errorResponse($pesan, $errors = null, $code)
    {
        $response = [
            'status' => 'error',
            'pesan' => $pesan,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    protected function paginationResponse($data, $pesan = null)
    {
        return response()->json([
            'status' => 'sukses',
            'pesan' => $pesan,
            'data' => $data->items(),
            'pagination' => [
                'total' => $data->total(),
                'per_halaman' => $data->perPage(),
                'halaman_sekarang' => $data->currentPage(),
                'halaman_terakhir' => $data->lastPage(),
                'dari' => $data->firstItem(),
                'sampai' => $data->lastItem()
            ]
        ]);
    }
}