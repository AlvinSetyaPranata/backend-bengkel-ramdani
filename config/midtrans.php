<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi untuk integrasi dengan Midtrans Payment Gateway
    |
    */

    // Mode production atau sandbox
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),

    // Sanitize input request
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),

    // Aktifkan 3DS untuk kartu kredit
    'is_3ds' => env('MIDTRANS_IS_3DS', true),

    // Kunci server dari dashboard Midtrans
    'server_key' => env('MIDTRANS_SERVER_KEY', ''),

    // Kunci client dari dashboard Midtrans
    'client_key' => env('MIDTRANS_CLIENT_KEY', ''),

    // Merchant ID dari dashboard Midtrans
    'merchant_id' => env('MIDTRANS_MERCHANT_ID', ''),
];