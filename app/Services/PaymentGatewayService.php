<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PaymentGatewayService
{
    protected $baseUrl;
    protected $serverKey;
    protected $clientKey;
    protected $isProduction;
    protected $isSanitized;
    protected $is3ds;

    /**
     * Inisialisasi service
     */
    public function __construct()
    {
        // Mengambil konfigurasi dari file .env
        $this->isProduction = config('midtrans.is_production', false);
        $this->isSanitized = config('midtrans.is_sanitized', true);
        $this->is3ds = config('midtrans.is_3ds', true);
        $this->serverKey = config('midtrans.server_key');
        $this->clientKey = config('midtrans.client_key');

        // Set base URL berdasarkan mode (production atau sandbox)
        $this->baseUrl = $this->isProduction 
            ? 'https://api.midtrans.com/' 
            : 'https://api.sandbox.midtrans.com/';
    }

    /**
     * Buat transaksi baru di Midtrans
     *
     * @param array $data Data untuk transaksi
     * @return array Response dari Midtrans
     */
    public function createTransaction(array $data)
    {
        try {
            // Persiapkan data transaksi untuk Midtrans
            $payload = [
                'transaction_details' => [
                    'order_id' => $data['order_id'],
                    'gross_amount' => (int)$data['amount'],
                ],
                'customer_details' => $data['customer_details'],
                'item_details' => $data['item_details'],
            ];

            // Tambahkan konfigurasi untuk metode pembayaran jika ada
            if (isset($data['payment_method']) && !empty($data['payment_method'])) {
                if ($data['payment_method'] === 'credit_card') {
                    $payload['credit_card'] = [
                        'secure' => $this->is3ds,
                    ];
                } else if (in_array($data['payment_method'], ['bca_va', 'bni_va', 'permata_va', 'other_va'])) {
                    $bankCode = str_replace('_va', '', $data['payment_method']);
                    $payload['bank_transfer'] = [
                        'bank' => $bankCode !== 'other' ? $bankCode : null
                    ];
                } else if ($data['payment_method'] === 'gopay') {
                    $payload['gopay'] = [
                        'enable_callback' => true,
                        'callback_url' => config('app.url') . '/pembayaran/callback'
                    ];
                } else if ($data['payment_method'] === 'shopeepay') {
                    $payload['shopeepay'] = [
                        'callback_url' => config('app.url') . '/pembayaran/callback'
                    ];
                }
            }

            // Kirim request ke Midtrans
            $response = Http::withBasicAuth($this->serverKey, '')
                ->post($this->baseUrl . 'v2/charge', $payload);

            // Cek response dari Midtrans
            if ($response->successful()) {
                $responseData = $response->json();
                Log::info('Midtrans transaction created', [
                    'transaction_id' => $data['transaction_id'],
                    'order_id' => $data['order_id'],
                    'response' => $responseData
                ]);

                // Siapkan respons untuk aplikasi
                $result = [
                    'success' => true,
                    'message' => 'Transaksi berhasil dibuat',
                    'data' => [
                        'transaction_id' => $responseData['transaction_id'] ?? null,
                        'order_id' => $responseData['order_id'],
                        'status_code' => $responseData['status_code'],
                        'status_message' => $responseData['status_message'],
                        'redirect_url' => $this->getRedirectUrl($responseData),
                        'token' => $responseData['transaction_id'] ?? null,
                        'payment_type' => $responseData['payment_type'] ?? null,
                    ]
                ];

                return $result;
            }

            // Jika ada kesalahan dari Midtrans
            $errorResponse = $response->json();
            Log::error('Midtrans error', [
                'transaction_id' => $data['transaction_id'],
                'error' => $errorResponse
            ]);

            return [
                'success' => false,
                'message' => $errorResponse['status_message'] ?? 'Gagal membuat transaksi',
                'error' => $errorResponse
            ];
        } catch (\Exception $e) {
            Log::error('Error in PaymentGatewayService@createTransaction: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Validasi notifikasi dari Midtrans
     *
     * @param array $data Data notifikasi dari Midtrans
     * @return bool Status validasi
     */
    public function validateNotification(array $data)
    {
        try {
            // Cek signature key dari Midtrans jika ada
            if (isset($data['signature_key'])) {
                $orderId = $data['order_id'];
                $statusCode = $data['status_code'];
                $grossAmount = $data['gross_amount'];
                $serverKey = $this->serverKey;
                $input = $orderId . $statusCode . $grossAmount . $serverKey;
                $signature = openssl_digest($input, 'sha512');

                // Bandingkan signature dari Midtrans dengan yang kita hitung
                return $signature === $data['signature_key'];
            }

            // Jika tidak ada signature, verifikasi dengan cara lain
            // Ini bisa disesuaikan dengan kebutuhan dan dokumentasi Midtrans
            return $this->checkStatus($data['transaction_id'])['success'];
        } catch (\Exception $e) {
            Log::error('Error in PaymentGatewayService@validateNotification: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Cek status transaksi di Midtrans
     *
     * @param string $transactionId ID transaksi Midtrans
     * @return array Status transaksi
     */
    public function checkStatus($transactionId)
    {
        try {
            // Kirim request untuk mendapatkan status transaksi
            $response = Http::withBasicAuth($this->serverKey, '')
                ->get($this->baseUrl . 'v2/' . $transactionId . '/status');

            if ($response->successful()) {
                $responseData = $response->json();
                
                return [
                    'success' => true,
                    'message' => 'Status transaksi berhasil diambil',
                    'data' => $responseData
                ];
            }

            $errorResponse = $response->json();
            Log::error('Midtrans status check error', [
                'transaction_id' => $transactionId,
                'error' => $errorResponse
            ]);

            return [
                'success' => false,
                'message' => $errorResponse['status_message'] ?? 'Gagal memeriksa status transaksi',
                'error' => $errorResponse
            ];
        } catch (\Exception $e) {
            Log::error('Error in PaymentGatewayService@checkStatus: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Membatalkan transaksi di Midtrans
     *
     * @param string $transactionId ID transaksi Midtrans
     * @return array Status pembatalan
     */
    public function cancelTransaction($transactionId)
    {
        try {
            // Kirim request untuk membatalkan transaksi
            $response = Http::withBasicAuth($this->serverKey, '')
                ->post($this->baseUrl . 'v2/' . $transactionId . '/cancel');

            if ($response->successful()) {
                $responseData = $response->json();
                
                return [
                    'success' => true,
                    'message' => 'Transaksi berhasil dibatalkan',
                    'data' => $responseData
                ];
            }

            $errorResponse = $response->json();
            Log::error('Midtrans cancel error', [
                'transaction_id' => $transactionId,
                'error' => $errorResponse
            ]);

            return [
                'success' => false,
                'message' => $errorResponse['status_message'] ?? 'Gagal membatalkan transaksi',
                'error' => $errorResponse
            ];
        } catch (\Exception $e) {
            Log::error('Error in PaymentGatewayService@cancelTransaction: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Refund transaksi di Midtrans
     *
     * @param string $transactionId ID transaksi Midtrans
     * @param float $amount Jumlah yang akan di-refund
     * @param string $reason Alasan refund
     * @return array Status refund
     */
    public function refundTransaction($transactionId, $amount, $reason)
    {
        try {
            // Persiapkan data untuk refund
            $payload = [
                'amount' => (int)$amount,
                'reason' => $reason
            ];

            // Kirim request untuk refund
            $response = Http::withBasicAuth($this->serverKey, '')
                ->post($this->baseUrl . 'v2/' . $transactionId . '/refund', $payload);

            if ($response->successful()) {
                $responseData = $response->json();
                
                return [
                    'success' => true,
                    'message' => 'Refund berhasil dilakukan',
                    'data' => $responseData
                ];
            }

            $errorResponse = $response->json();
            Log::error('Midtrans refund error', [
                'transaction_id' => $transactionId,
                'error' => $errorResponse
            ]);

            return [
                'success' => false,
                'message' => $errorResponse['status_message'] ?? 'Gagal melakukan refund',
                'error' => $errorResponse
            ];
        } catch (\Exception $e) {
            Log::error('Error in PaymentGatewayService@refundTransaction: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Mendapatkan URL redirect dari respons Midtrans
     *
     * @param array $response Respons dari Midtrans
     * @return string|null URL redirect
     */
    private function getRedirectUrl($response)
    {
        // Cek tipe pembayaran dan ambil URL yang sesuai
        if (isset($response['redirect_url'])) {
            return $response['redirect_url'];
        }
        
        if (isset($response['actions']) && is_array($response['actions'])) {
            foreach ($response['actions'] as $action) {
                if (isset($action['url']) && !empty($action['url'])) {
                    return $action['url'];
                }
            }
        }

        // Untuk metode QRIS jika ada
        if (isset($response['actions'][0]['url'])) {
            return $response['actions'][0]['url'];
        }

        // Untuk GoPay
        if (isset($response['payment_type']) && $response['payment_type'] === 'gopay') {
            if (isset($response['actions']) && is_array($response['actions'])) {
                foreach ($response['actions'] as $action) {
                    if ($action['name'] === 'generate-qr-code') {
                        return $action['url'];
                    }
                }
            }
        }

        // Untuk ShopeePay
        if (isset($response['payment_type']) && $response['payment_type'] === 'shopeepay') {
            if (isset($response['actions']) && is_array($response['actions'])) {
                foreach ($response['actions'] as $action) {
                    if ($action['name'] === 'deeplink-redirect') {
                        return $action['url'];
                    }
                }
            }
        }

        return null;
    }
}