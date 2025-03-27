<?php

namespace App\Http\Controllers;

use App\Models\Metode_Pembayaran;
use App\Models\Pembayaran;
use App\Models\Pesanan_Perbaikan;
use App\Services\PaymentGatewayService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
class PembayaranController extends Controller
{
    use ApiResponse;
    protected $paymentGatewayService;

    public function __construct(PaymentGatewayService $paymentGatewayService)
    {
        $this->paymentGatewayService = $paymentGatewayService;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Pembayaran::with([
                'pesananPerbaikan:id,kendaraan_pelanggan_id,tanggal_masuk,status,total_biaya',
                'user:id,name,email',
                'metodePembayaran:id,nama,kode'
            ]);
            
            // Filter berdasarkan status pembayaran jika tersedia
            if ($request->has('status') && in_array($request->status, ['pending', 'processing', 'settlement', 'denied', 'canceled', 'expired', 'refund'])) {
                $query->where('status_pembayaran', $request->status);
            }
            
            // Filter berdasarkan tanggal pembayaran jika tersedia
            if ($request->has('dari_tanggal') && $request->has('sampai_tanggal')) {
                $query->whereBetween('tanggal_pembayaran', [$request->dari_tanggal, $request->sampai_tanggal]);
            }
            
            // Filter berdasarkan metode pembayaran jika tersedia
            if ($request->has('metode_id')) {
                $query->where('metode_pembayaran_id', $request->metode_id);
            }
            
            // Opsi pengurutan
            $sortField = $request->input('sort_by', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            
            // Hanya bidang pengurutan yang valid
            if (in_array($sortField, ['tanggal_pembayaran', 'jumlah_bayar', 'status_pembayaran', 'created_at'])) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }
            
            // Jika user biasa, hanya tampilkan pembayaran miliknya
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                $query->where('user_id', Auth::id());
            }
            
            $pembayarans = $query->paginate($request->input('per_page', 10));
            
            // Tambahkan metadata untuk dasbor admin
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\Admin') {
                $stats = [
                    'total_pembayaran' => Pembayaran::count(),
                    'pending' => Pembayaran::where('status_pembayaran', 'pending')->count(),
                    'processing' => Pembayaran::where('status_pembayaran', 'processing')->count(),
                    'settlement' => Pembayaran::where('status_pembayaran', 'settlement')->count(),
                    'denied' => Pembayaran::where('status_pembayaran', 'denied')->count(),
                    'canceled' => Pembayaran::where('status_pembayaran', 'canceled')->count(),
                    'expired' => Pembayaran::where('status_pembayaran', 'expired')->count(),
                    'refund' => Pembayaran::where('status_pembayaran', 'refund')->count(),
                    'total_pendapatan' => Pembayaran::where('status_pembayaran', 'settlement')
                        ->sum('jumlah_bayar'),
                    'pendapatan_bulan_ini' => Pembayaran::where('status_pembayaran', 'settlement')
                        ->whereMonth('tanggal_pembayaran', Carbon::now()->month)
                        ->whereYear('tanggal_pembayaran', Carbon::now()->year)
                        ->sum('jumlah_bayar')
                ];
                
                return $this->paginationResponse($pembayarans, 'Daftar pembayaran berhasil diambil', $stats);
            }
            
            return $this->paginationResponse($pembayarans, 'Daftar pembayaran berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal mengambil daftar pembayaran', $e->getMessage(), 500);
        }
    }


    public function initiatePayment(Request $request)
    {
        try {
            DB::beginTransaction();
            
            $request->validate([
                'pesanan_perbaikan_id' => 'required|uuid|exists:pesanan__perbaikans,id',
                'metode_pembayaran_id' => 'required|exists:metode__pembayarans,id',
                'keterangan' => 'nullable|string|max:255',
            ]);
            
            // Cek jika pesanan sudah lunas
            $existingPayment = Pembayaran::where('pesanan_perbaikan_id', $request->pesanan_perbaikan_id)
                ->whereIn('status_pembayaran', ['settlement', 'processing'])
                ->exists();
                
            if ($existingPayment) {
                return $this->errorResponse(
                    'Pesanan sudah dibayar', 
                    'Terdapat pembayaran dengan status lunas atau sedang diproses untuk pesanan ini', 
                    422
                );
            }
            
            // Cek pesanan perbaikan
            $pesanan = Pesanan_Perbaikan::findOrFail($request->pesanan_perbaikan_id);
            $metodePembayaran = Metode_Pembayaran::findOrFail($request->metode_pembayaran_id);
            
            // Pengguna biasa hanya dapat membayar pesanan mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                $kendaraan = $pesanan->kendaraan;
                if (Auth::id() !== $kendaraan->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk membayar pesanan ini', null, 403);
                }
            }
            
            // Generate invoice number
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(8));
            
            // Buat data pembayaran
            $pembayaranData = [
                'id' => Str::uuid(),
                'pesanan_perbaikan_id' => $request->pesanan_perbaikan_id,
                'user_id' => Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User' ? 
                        Auth::id() : $pesanan->kendaraan->user_id,
                'metode_pembayaran_id' => $request->metode_pembayaran_id,
                'jumlah_bayar' => $pesanan->total_biaya,
                'status_pembayaran' => 'pending',
                'keterangan' => $request->keterangan,
                'invoice_number' => $invoiceNumber,
                'tanggal_jatuh_tempo' => Carbon::now()->addDays(1), // 24 jam
                'attempts' => 0
            ];
            
            // Pengguna untuk gateway
            $user = $pesanan->kendaraan->user;
            
            // Persiapkan data untuk layanan pembayaran
            $paymentData = [
                'transaction_id' => $pembayaranData['id'],
                'order_id' => $invoiceNumber,
                'amount' => $pesanan->total_biaya,
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '-'
                ],
                'item_details' => [
                    [
                        'id' => $pesanan->id,
                        'price' => $pesanan->total_biaya,
                        'quantity' => 1,
                        'name' => 'Perbaikan untuk ' . $pesanan->kendaraan->nama_kendaraan . ' (' . $pesanan->kendaraan->plat_nomor . ')'
                    ]
                ],
                'payment_method' => $metodePembayaran->kode
            ];
            
            // Inisiasi transaksi pembayaran dengan gateway
            $response = $this->paymentGatewayService->createTransaction($paymentData);
            
            if (!$response['success']) {
                throw new \Exception($response['message'] ?? 'Gagal membuat transaksi pembayaran');
            }
            
            // Tambahkan informasi pembayaran dari gateway
            $pembayaranData['payment_token'] = $response['data']['token'] ?? null;
            $pembayaranData['payment_url'] = $response['data']['redirect_url'] ?? null;
            $pembayaranData['payment_reference'] = $response['data']['transaction_id'] ?? null;
            
            // Simpan pembayaran
            $pembayaran = Pembayaran::create($pembayaranData);
            
            // Log aktivitas pembayaran
            $this->logPaymentActivity($pembayaran->id, 'payment_initiated', 'Pembayaran diinisiasi oleh pengguna');
            
            // Tambahkan relasi pesanan dan user untuk respons
            $pembayaran->load([
                'pesananPerbaikan:id,kendaraan_pelanggan_id,tanggal_masuk,status,total_biaya',
                'user:id,name,email',
                'metodePembayaran:id,nama,kode'
            ]);
            
            $responseData = [
                'payment' => $pembayaran,
                'payment_url' => $pembayaran->payment_url,
                'expires_at' => $pembayaran->tanggal_jatuh_tempo->format('Y-m-d H:i:s')
            ];
            
            DB::commit();
            return $this->successResponse($responseData, 'Pembayaran berhasil diinisiasi', 201);
        } catch(ValidationException $e) {
            DB::rollBack();
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch(\Exception $e) {
            DB::rollBack();
            Log::error('Error in PembayaranController@initiatePayment: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal menginisiasi pembayaran', $e->getMessage(), 500);
        }
    }


    public function handleNotification(Request $request)
    {
        try {
            // Verifikasi signature dari gateway
            $isValid = $this->paymentGatewayService->validateNotification($request->all());
            
            if (!$isValid) {
                Log::warning('Invalid payment notification received', [
                    'data' => $request->all()
                ]);
                return $this->errorResponse('Signature tidak valid', null, 403);
            }
            
            DB::beginTransaction();
            
            // Ambil data dari notifikasi
            $transactionStatus = $request->transaction_status ?? null;
            $orderID = $request->order_id ?? null;
            $transactionID = $request->transaction_id ?? null;
            $statusCode = $request->status_code ?? null;
            
            // Cari pembayaran berdasarkan nomor invoice atau payment reference
            $pembayaran = Pembayaran::where('invoice_number', $orderID)
                ->orWhere('payment_reference', $transactionID)
                ->first();
                
            if (!$pembayaran) {
                throw new \Exception('Pembayaran tidak ditemukan: ' . $orderID);
            }
            
            // Catat status asli dari gateway
            $statusMsg = 'Status gateway: ' . $transactionStatus . ' (' . $statusCode . ')';
            $this->logPaymentActivity($pembayaran->id, 'notification_received', $statusMsg);
            
            // Mapping status dari gateway ke aplikasi
            $statusMapping = [
                'pending' => 'pending',
                'capture' => 'processing',
                'settlement' => 'settlement',
                'deny' => 'denied',
                'cancel' => 'canceled',
                'expire' => 'expired',
                'refund' => 'refund',
                'partial_refund' => 'refund',
                'failure' => 'failed'
            ];
            
            $newStatus = $statusMapping[$transactionStatus] ?? 'pending';
            
            // Update status pembayaran
            $pembayaran->status_pembayaran = $newStatus;
            
            // Jika settlement, update tanggal pembayaran
            if ($newStatus === 'settlement') {
                $pembayaran->tanggal_pembayaran = Carbon::now();
            }
            
            // Update data tambahan dari notifikasi
            $pembayaran->payment_data = json_encode($request->all());
            $pembayaran->save();
            
            // Jika settlement, update status pesanan jika masih menunggu
            if ($newStatus === 'settlement') {
                $pesanan = $pembayaran->pesananPerbaikan;
                if ($pesanan && $pesanan->status === 'menunggu') {
                    $pesanan->status = 'proses';
                    $pesanan->tanggal_perbaikan = Carbon::now()->toDateString();
                    $pesanan->save();
                    
                    $this->logPaymentActivity($pembayaran->id, 'order_status_updated', 'Status pesanan diperbarui menjadi proses');
                }
            }
            
            DB::commit();
            return $this->successResponse(['status' => 'success'], 'Notifikasi berhasil diproses');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in PembayaranController@handleNotification: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return $this->errorResponse('Gagal memproses notifikasi pembayaran', $e->getMessage(), 500);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $pembayaran = Pembayaran::with([
                'pesananPerbaikan',
                'user:id,name,email,phone',
                'metodePembayaran'
            ])->findOrFail($id);
            
            // Pengguna biasa hanya dapat melihat pembayaran mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pembayaran->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk melihat detail pembayaran', null, 403);
                }
            }
            
            // Tambahkan informasi kendaraan dan riwayat aktivitas
            $pembayaran->pesananPerbaikan->load('kendaraan:id,nama_kendaraan,plat_nomor');
            $pembayaran->activities = DB::table('payment_activities')
                ->where('pembayaran_id', $id)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return $this->successResponse($pembayaran, 'Detail pembayaran berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Pembayaran tidak ditemukan', "ID pembayaran tidak valid: {$id}", 404);
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@show: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal mengambil detail pembayaran', $e->getMessage(), 500);
        }
    }

    public function checkStatus($id)
    {
        try {
            $pembayaran = Pembayaran::findOrFail($id);
            
            // Pengguna biasa hanya dapat melihat pembayaran mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pembayaran->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk memeriksa status pembayaran', null, 403);
                }
            }
            
            // Cek status ke gateway
            $response = $this->paymentGatewayService->checkStatus($pembayaran->payment_reference);
            
            if (!$response['success']) {
                throw new \Exception($response['message'] ?? 'Gagal memeriksa status pembayaran');
            }
            
            // Catat aktivitas
            $this->logPaymentActivity($pembayaran->id, 'status_checked', 'Status diperiksa oleh pengguna');
            
            return $this->successResponse($response['data'], 'Status pembayaran berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@checkStatus: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal memeriksa status pembayaran', $e->getMessage(), 500);
        }
    }

    public function cancelPayment($id)
    {
        try {
            DB::beginTransaction();
            
            $pembayaran = Pembayaran::findOrFail($id);
            
            // Pengguna biasa hanya dapat membatalkan pembayaran mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pembayaran->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk membatalkan pembayaran', null, 403);
                }
            }
            
            // Hanya pembayaran dengan status pending yang dapat dibatalkan
            if ($pembayaran->status_pembayaran !== 'pending') {
                return $this->errorResponse(
                    'Tidak dapat membatalkan pembayaran', 
                    'Hanya pembayaran dengan status pending yang dapat dibatalkan', 
                    422
                );
            }
            
            // Batalkan pembayaran di gateway jika ada referensi
            if ($pembayaran->payment_reference) {
                $response = $this->paymentGatewayService->cancelTransaction($pembayaran->payment_reference);
                
                if (!$response['success']) {
                    throw new \Exception($response['message'] ?? 'Gagal membatalkan transaksi pembayaran');
                }
            }
            
            // Update status pembayaran
            $pembayaran->status_pembayaran = 'canceled';
            $pembayaran->save();
            
            // Catat aktivitas
            $this->logPaymentActivity($pembayaran->id, 'payment_canceled', 'Pembayaran dibatalkan oleh pengguna');
            
            DB::commit();
            return $this->successResponse($pembayaran, 'Pembayaran berhasil dibatalkan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in PembayaranController@cancelPayment: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal membatalkan pembayaran', $e->getMessage(), 500);
        }
    }

    public function generateInvoice($id)
    {
        try {
            $pembayaran = Pembayaran::with([
                'pesananPerbaikan',
                'user:id,name,email,phone',
                'metodePembayaran'
            ])->findOrFail($id);
            
            // Pengguna biasa hanya dapat melihat pembayaran mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pembayaran->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk mengakses invoice', null, 403);
                }
            }
            
            // Tambahkan informasi kendaraan
            $pembayaran->pesananPerbaikan->load('kendaraan:id,nama_kendaraan,plat_nomor');
            
            // Generate PDF menggunakan facade atau library PDF
            $pdf = app('pdf')->loadView('invoices.payment', [
                'pembayaran' => $pembayaran
            ]);
            
            // Catat aktivitas
            $this->logPaymentActivity($pembayaran->id, 'invoice_generated', 'Invoice diunduh oleh pengguna');
            
            return $pdf->download('Invoice-' . $pembayaran->invoice_number . '.pdf');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@generateInvoice: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal menghasilkan invoice', $e->getMessage(), 500);
        }
    }

    public function verifyPayment(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            // Hanya admin yang dapat memverifikasi pembayaran secara manual
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                return $this->errorResponse('Tidak diizinkan untuk memverifikasi pembayaran', null, 403);
            }
            
            $request->validate([
                'status_pembayaran' => 'required|in:settlement,denied',
                'keterangan' => 'nullable|string|max:255',
            ]);
            
            $pembayaran = Pembayaran::findOrFail($id);
            $oldStatus = $pembayaran->status_pembayaran;
            
            // Update status pembayaran
            $pembayaran->status_pembayaran = $request->status_pembayaran;
            $pembayaran->keterangan = $request->keterangan ?? $pembayaran->keterangan;
            
            // Jika settlement, update tanggal pembayaran
            if ($request->status_pembayaran === 'settlement' && !$pembayaran->tanggal_pembayaran) {
                $pembayaran->tanggal_pembayaran = Carbon::now();
            }
            
            $pembayaran->save();
            
            // Catat aktivitas
            $adminId = Auth::id();
            $this->logPaymentActivity(
                $pembayaran->id, 
                'manual_verification', 
                "Pembayaran diverifikasi secara manual oleh admin (ID: {$adminId}). Status: {$request->status_pembayaran}"
            );
            
            // Jika status berubah menjadi settlement, update juga status pesanannya jika masih menunggu
            if ($oldStatus !== 'settlement' && $pembayaran->status_pembayaran === 'settlement') {
                $pesanan = $pembayaran->pesananPerbaikan;
                if ($pesanan->status === 'menunggu') {
                    $pesanan->status = 'proses';
                    $pesanan->tanggal_perbaikan = Carbon::now()->toDateString();
                    $pesanan->save();
                    
                    $this->logPaymentActivity($pembayaran->id, 'order_status_updated', 'Status pesanan diperbarui menjadi proses');
                }
            }
            
            // Reload dengan relasi
            $pembayaran->load([
                'pesananPerbaikan:id,kendaraan_pelanggan_id,tanggal_masuk,status,total_biaya',
                'user:id,name,email',
                'metodePembayaran'
            ]);
            
            DB::commit();
            return $this->successResponse($pembayaran, 'Pembayaran berhasil diverifikasi');
        } catch(ValidationException $e) {
            DB::rollBack();
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch(\Exception $e) {
            DB::rollBack();
            Log::error('Error in PembayaranController@verifyPayment: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal memverifikasi pembayaran', $e->getMessage(), 500);
        }
    }

    public function refundPayment(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            // Hanya admin yang dapat melakukan refund
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                return $this->errorResponse('Tidak diizinkan untuk melakukan refund', null, 403);
            }
            
            $request->validate([
                'amount' => 'required|numeric|min:0',
                'reason' => 'required|string|max:255',
            ]);
            
            $pembayaran = Pembayaran::findOrFail($id);
            
            // Hanya pembayaran dengan status settlement yang dapat di-refund
            if ($pembayaran->status_pembayaran !== 'settlement') {
                return $this->errorResponse(
                    'Tidak dapat melakukan refund', 
                    'Hanya pembayaran dengan status settlement yang dapat di-refund', 
                    422
                );
            }
            
            // Jumlah refund tidak boleh melebihi jumlah pembayaran
            if ($request->amount > $pembayaran->jumlah_bayar) {
                return $this->errorResponse(
                    'Jumlah refund tidak valid', 
                    'Jumlah refund tidak boleh melebihi jumlah pembayaran', 
                    422
                );
            }
            
            // Kirim permintaan refund ke gateway
            $response = $this->paymentGatewayService->refundTransaction(
                $pembayaran->payment_reference,
                $request->amount,
                $request->reason
            );
            
            if (!$response['success']) {
                throw new \Exception($response['message'] ?? 'Gagal melakukan refund');
            }
            
            // Update status pembayaran
            $pembayaran->status_pembayaran = 'refund';
            $pembayaran->keterangan = 'Refund: ' . $request->reason;
            $pembayaran->refund_amount = $request->amount;
            $pembayaran->refund_date = Carbon::now();
            $pembayaran->save();
            
            // Catat aktivitas
            $adminId = Auth::id();
            $this->logPaymentActivity(
                $pembayaran->id, 
                'payment_refunded', 
                "Pembayaran di-refund oleh admin (ID: {$adminId}). Jumlah: {$request->amount}. Alasan: {$request->reason}"
            );
            
            DB::commit();
            return $this->successResponse($pembayaran, 'Pembayaran berhasil di-refund');
        } catch(ValidationException $e) {
            DB::rollBack();
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch(\Exception $e) {
            DB::rollBack();
            Log::error('Error in PembayaranController@refundPayment: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal melakukan refund', $e->getMessage(), 500);
        }
    }

    public function getPembayaranPesanan($pesananId)
    {
        try {
            $pesanan = Pesanan_Perbaikan::with('kendaraan')->findOrFail($pesananId);
            
            // Pengguna biasa hanya dapat melihat pembayaran pesanan mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pesanan->kendaraan->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk melihat pembayaran pesanan ini', null, 403);
                }
            }
            
            $pembayarans = Pembayaran::where('pesanan_perbaikan_id', $pesananId)
                ->with([
                    'user:id,name,email',
                    'metodePembayaran'
                ])
                ->orderBy('created_at', 'desc')
                ->get();
                
            return $this->successResponse($pembayarans, 'Daftar pembayaran pesanan berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@getPembayaranPesanan: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal mengambil pembayaran pesanan', $e->getMessage(), 500);
        }
    }

    public function getPembayaranUser($userId = null)
    {
        try {
            // Jika tidak ada userId yang diberikan, gunakan pengguna yang diautentikasi
            if (!$userId) {
                $userId = Auth::id();
            } 
            
            // Pengguna biasa hanya dapat melihat pembayaran mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User' && $userId != Auth::id()) {
                return $this->errorResponse('Tidak diizinkan untuk melihat pembayaran pengguna lain', null, 403);
            }
            
            $pembayarans = Pembayaran::where('user_id', $userId)
                ->with([
                    'pesananPerbaikan:id,kendaraan_pelanggan_id,tanggal_masuk,status,total_biaya',
                    'metodePembayaran'
                ])
                ->orderBy('created_at', 'desc')
                ->paginate(10);
                
            return $this->paginationResponse($pembayarans, 'Daftar pembayaran pengguna berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@getPembayaranUser: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal mengambil pembayaran pengguna', $e->getMessage(), 500);
        }
    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pembayaran $pembayaran)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pembayaran $pembayaran)
    {
        //
    }

    public function getMetodePembayaran()
    {
        try {
            $metodes = Metode_Pembayaran::where('is_active', true)
                ->orderBy('nama')
                ->get();
                
            return $this->successResponse($metodes, 'Daftar metode pembayaran berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@getMetodePembayaran: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal mengambil daftar metode pembayaran', $e->getMessage(), 500);
        }
    }

    public function getStatistics(Request $request)
    {
        try {
            // Hanya admin yang dapat melihat statistik
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                return $this->errorResponse('Tidak diizinkan untuk melihat statistik pembayaran', null, 403);
            }
            
            $period = $request->input('period', 'monthly');
            $year = $request->input('year', Carbon::now()->year);
            $month = $request->input('month', Carbon::now()->month);
            
            $stats = [];
            
            // Statistik berdasarkan periode
            if ($period == 'daily') {
                // Statistik harian (dalam satu bulan)
                $daysInMonth = Carbon::createFromDate($year, $month, 1)->daysInMonth;
                
                for ($day = 1; $day <= $daysInMonth; $day++) {
                    $date = Carbon::createFromDate($year, $month, $day);
                    
                    if ($date->isFuture()) {
                        break;
                    }
                    
                    $dayStats = [
                        'date' => $date->format('Y-m-d'),
                        'label' => $date->format('d M'),
                        'total' => Pembayaran::whereDate('tanggal_pembayaran', $date->format('Y-m-d'))
                            ->where('status_pembayaran', 'settlement')
                            ->sum('jumlah_bayar')
                    ];
                    
                    $stats[] = $dayStats;
                }
            } else if ($period == 'monthly') {
                // Statistik bulanan (dalam satu tahun)
                for ($m = 1; $m <= 12; $m++) {
                    $date = Carbon::createFromDate($year, $m, 1);
                    
                    if ($date->isFuture()) {
                        break;
                    }
                    
                    $monthStats = [
                        'date' => $date->format('Y-m'),
                        'label' => $date->format('M'),
                        'total' => Pembayaran::whereYear('tanggal_pembayaran', $year)
                            ->whereMonth('tanggal_pembayaran', $m)
                            ->where('status_pembayaran', 'settlement')
                            ->sum('jumlah_bayar')
                    ];
                    
                    $stats[] = $monthStats;
                }
            } else if ($period == 'yearly') {
                // Statistik tahunan (5 tahun terakhir)
                $startYear = $year - 4;
                
                for ($y = $startYear; $y <= $year; $y++) {
                    $yearStats = [
                        'date' => (string) $y,
                        'label' => (string) $y,
                        'total' => Pembayaran::whereYear('tanggal_pembayaran', $y)
                            ->where('status_pembayaran', 'settlement')
                            ->sum('jumlah_bayar')
                    ];
                    
                    $stats[] = $yearStats;
                }
            }
            
            // Ringkasan statistik
            $summary = [
                'pendapatan_total' => Pembayaran::where('status_pembayaran', 'settlement')
                    ->sum('jumlah_bayar'),
                'pendapatan_tahun_ini' => Pembayaran::where('status_pembayaran', 'settlement')
                    ->whereYear('tanggal_pembayaran', Carbon::now()->year)
                    ->sum('jumlah_bayar'),
                'pendapatan_bulan_ini' => Pembayaran::where('status_pembayaran', 'settlement')
                    ->whereYear('tanggal_pembayaran', Carbon::now()->year)
                    ->whereMonth('tanggal_pembayaran', Carbon::now()->month)
                    ->sum('jumlah_bayar'),
                'pembayaran_berhasil' => Pembayaran::where('status_pembayaran', 'settlement')->count(),
                'pembayaran_pending' => Pembayaran::whereIn('status_pembayaran', ['pending', 'processing'])->count(),
                'pembayaran_gagal' => Pembayaran::whereIn('status_pembayaran', ['denied', 'canceled', 'expired'])->count()
            ];
            
            $result = [
                'period' => $period,
                'year' => $year,
                'month' => $month,
                'stats' => $stats,
                'summary' => $summary
            ];
            
            return $this->successResponse($result, 'Statistik pembayaran berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Error in PembayaranController@getStatistics: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Gagal mengambil statistik pembayaran', $e->getMessage(), 500);
        }
    }
    
    /**
     * Helper function untuk mencatat aktivitas pembayaran
     */
    private function logPaymentActivity($paymentId, $type, $description)
    {
        try {
            DB::table('payment_activities')->insert([
                'id' => Str::uuid(),
                'pembayaran_id' => $paymentId,
                'user_id' => Auth::id(),
                'type' => $type,
                'description' => $description,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);
        } catch (\Exception $e) {
            Log::error('Error logging payment activity: ' . $e->getMessage());
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pembayaran $pembayaran)
    {
        //
    }
}
