<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\ApiResponse;

class PembayaranController extends Controller
{

    use ApiResponse;
    protected $payment;


    public function __construct(Pembayaran $pembayaran)
    {       
        $this->payment = $pembayaran;
    }


    public function bayar(Request $request, $paymentId) {

        

        try {

            $payment = Pembayaran::findOrFail($paymentId);

            return $this->successResponse(["payment" => $payment], 'Pesanan perbaikan berhasil ditambahkan');

            DB::beginTransaction();

            $request->validate([
                'pesanan_perbaikan_id' => 'required|uuid|exists:kendaraans,id',
                'user_id' => 'required|uuid|exists:kendaraans,id'
            ]);


            return $this->successResponse([], 'Pesanan perbaikan berhasil ditambahkan', 201);

        }  catch(\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Validasi gagal', $e->getMessage(), 422);
        }
    }


    public function getPaymentsById($paymentId) {

        echo  $paymentId;

        try {
            $payments = Pembayaran::findOrFail($paymentId);

            return $this->successResponse([
                "messege" => "Data pembayaran",
                "data" => $payments
            ]);

        } catch(\Exception $e) {
            return $this->errorResponse("Pembayaran tidak ditemukan", $e, 404);
        }
    }
}
