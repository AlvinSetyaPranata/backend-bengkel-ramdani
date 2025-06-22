<?php

namespace App\Services;

use Midtrans\Snap;
use Midtrans\Transaction;
use Illuminate\Support\Facades\Log;
use Exception;

class PaymentService
{
    /**
     * Initiates a payment and returns a Snap token
     */
    public function initiatePayment(array $data): string
    {
        try {
            $transaction = [
                'transaction_details' => [
                    'order_id' => $data['order_id'],
                    'gross_amount' => $data['amount'],
                ],
                'item_details' => $data['items'] ?? [],
            ];

            return Snap::getSnapToken($transaction);
        } catch (Exception $e) {
            Log::error("Midtrans Snap token error: " . $e->getMessage());
            throw new Exception("Failed to initiate payment.");
        }
    }
}
