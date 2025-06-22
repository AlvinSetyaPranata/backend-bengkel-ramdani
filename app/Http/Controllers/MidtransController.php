<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Midtrans\Notification;
use App\Models\Pembayaran;

class MidtransController extends Controller
{
    public function NotificationCallback(Request $request) {
        $notification = new Notification();

         $transaction = $notification->transaction_status;
         $order_id = $notification->order_id;
        //  $type = $notification->payment_type;
        // $fraud = $notification->fraud_status;


        $payment = Pembayaran::where("pesanan_perbaikan_id", "=", $order_id);

        if ($payment) {
            return response()->json(["messege" => "Order not found!"]);
        }


        switch($transaction) {
            // case 'capture':
            //     if ($type == 'credit_card') {
            //         if ($fraud == 'challenge') {
            //             $payment->status_pembayaran = 'challenge';
            //         } else {
            //             $payment->status_pembayaran = 'success';
            //         }
            //     }
            //     break;

            case 'settlement':
                $payment->status_pembayaran = 'Sudah Dibayar';
                break;

            case 'pending':
                $payment->status_pembayaran = 'Proses Bayar';
                break;

            case 'deny':
                $payment->status_pembayaran = "Pembayaran Ditolak";
                break;
                
            case 'expire':
            case 'cancel':
                $payment->status_pembayaran = "Pembayaran Dibatalkan";
                break;

            default:
                $payment->status_pembayaran = 'Tejadi Kesalahan';
                break;
        }

        $payment->save();

        return response()->json(["messege" => "Callback handled succesfully!"], 200);
    }
}
