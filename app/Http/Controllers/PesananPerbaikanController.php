<?php

namespace App\Http\Controllers;

use App\Models\Kendaraan;
use App\Models\Pembayaran;
use App\Models\Pesanan_Perbaikan;
use App\Models\User;
use App\Traits\ApiResponse;
use App\Services\PaymentService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PesananPerbaikanController extends Controller
{
    use ApiResponse;

    protected $paymentService;

    public function __construct(PaymentService $payment)
    {
        $this->paymentService = $payment;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Pesanan_Perbaikan::with([
                'kendaraan' => function ($query) {
                    $query->select('id', 'user_id', 'nama_kendaraan', 'plat_nomor', 'tahun_produksi', 'warna')
                        ->with('user:id,name,email,avatar,status');
                }
            ]);

            // Filter berdasarkan status jika tersedia
            if ($request->has('status') && in_array($request->status, ['menunggu', 'proses', 'selesai', 'batal'])) {
                $query->where('status', $request->status);
            }

            // Filter berdasarkan tanggal jika tersedia
            if ($request->has('dari_tanggal') && $request->has('sampai_tanggal')) {
                $query->whereBetween('tanggal_masuk', [$request->dari_tanggal, $request->sampai_tanggal]);
            }

            // Opsi pengurutan
            $sortField = $request->input('sort_by', 'tanggal_masuk');
            $sortDirection = $request->input('sort_direction', 'desc');

            // Hanya bidang pengurutan yang valid
            if (in_array($sortField, ['tanggal_masuk', 'tanggal_perbaikan', 'tanggal_selesai', 'total_biaya', 'status'])) {
                $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            }

            $pesanans = $query->paginate($request->input('per_page', 10));

            $order_list = array_map(function ($order) {
                $payment_data = Pembayaran::where("pesanan_perbaikan_id", "=", $order["id"])->first();

                $kendaraan_data = Kendaraan::where("id", "=", $order["kendaraan_pelanggan_id"])->first();

                $user_data = User::where("id", "=", $kendaraan_data["user_id"])->first();

                return [
                    'id' => $order["id"],
                    'kendaraan_pelanggan_id' => $order["kendaraan_pelanggan_id"],
                    'kendaraan' => [
                        'user_id' => $kendaraan_data["user_id"],
                        'nama_kendaraan' => $kendaraan_data["nama_kendaraan"],
                        'plat_nomor' => $kendaraan_data["plat_nomor"],
                        'gambar_kendaraan' => $kendaraan_data["gambar_kendaraan"],
                        'tahun_produksi' => $kendaraan_data["tahun_produksi"],
                        'warna' => $kendaraan_data["warna"],
                        'user' => $user_data
                    ],
                    'tanggal_masuk' => $order["tanggal_masuk"],
                    'tanggal_perbaikan' => $order["tanggal_perbaikan"],
                    'tanggal_selesai' => $order["tanggal_selesai"],
                    'total_biaya' => $order["total_biaya"],
                    'status' => $order["status"],
                    'keterangan' => $order["keterangan"],
                    "metode_pembayaran" => $payment_data->metode_pembayaran,
                    "token_pembayaran" => $payment_data->payment_link
                ];
            }, $pesanans->items());

            $responseData = [
                'status' => 'sukses',
                'pesan' => "Daftar pesanan perbaikan berhasil diambil",
                'data' => $order_list,
                'pagination' => [
                    'total' => $pesanans->total(),
                    'per_halaman' => $pesanans->perPage(),
                    'halaman_sekarang' => $pesanans->currentPage(),
                    'halaman_terakhir' => $pesanans->lastPage(),
                    'dari' => $pesanans->firstItem(),
                    'sampai' => $pesanans->lastItem()
                ]
            ];

            // Tambahkan metadata untuk dasbor admin
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\Admin') {
                $stats = [
                    'total_pesanan' => Pesanan_Perbaikan::count(),
                    'menunggu' => Pesanan_Perbaikan::where('status', 'menunggu')->count(),
                    'proses' => Pesanan_Perbaikan::where('status', 'proses')->count(),
                    'selesai' => Pesanan_Perbaikan::where('status', 'selesai')->count(),
                    'batal' => Pesanan_Perbaikan::where('status', 'batal')->count(),
                    'pendapatan_bulan_ini' => Pesanan_Perbaikan::where('status', 'selesai')
                        ->whereMonth('tanggal_selesai', Carbon::now()->month)
                        ->whereYear('tanggal_selesai', Carbon::now()->year)
                        ->sum('total_biaya')
                ];

                return $this->paginationResponse($pesanans, $stats);
            }

            return response()->json($responseData);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil daftar pesanan perbaikan', $e->getMessage(), 500);
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
    public function  store(Request $request)
    {
        try {
            DB::beginTransaction();

            $request->validate([
                'kendaraan_pelanggan_id' => 'required|uuid|exists:kendaraans,id',
                'tanggal_masuk' => 'required|date',
                'tanggal_perbaikan' => 'nullable|date|after_or_equal:tanggal_masuk',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_perbaikan',
                'metode_pembayaran' => 'sometimes|in:cash,transfer',
                'total_biaya' => 'required|numeric|min:0',
                'status' => 'sometimes|in:menunggu,proses,selesai,batal',
                'keterangan' => 'nullable|string|max:1000',
            ]);

            // Cek apakah kendaraan sedang dalam proses perbaikan
            $existingRepair = Pesanan_Perbaikan::where('kendaraan_pelanggan_id', $request->kendaraan_pelanggan_id)
                ->whereIn('status', ['menunggu', 'proses'])
                ->first();

            if ($existingRepair) {
                return $this->errorResponse(
                    'Kendaraan sedang dalam proses perbaikan',
                    'Terdapat pesanan perbaikan yang sedang aktif untuk kendaraan ini',
                    422
                );
            }


            $data = [
                "kendaraan_pelanggan_id" => $request['kendaraan_pelanggan_id'],
                "status" => 'menunggu',
                "tanggal_masuk" => $request["tanggal_masuk"],
                "tanggal_perbaikan" => $request["tanggal_perbaikan"],
                "tanggal_selesai" => $request["tanggal_selesai"],
                "total_biaya" => $request["total_biaya"],
                "keterangan" => $request["keterangan"],
            ];

            $pesanan = Pesanan_Perbaikan::create($data);
            $orderId = $pesanan["id"];

            if ($request["metode_pembayaran"] == "cash") {
                $snapToken = "";
            } else {
                $snapToken = $this->paymentService->initiatePayment([
                    'order_id' => $orderId,
                    'amount' => $data["total_biaya"],
                    'items' => [
                        [
                            'id' => 'Jasa Perbaikan',
                            'price' => $data["total_biaya"],
                            'quantity' => 1,
                            'name' => $data["keterangan"],
                        ],
                    ],
                ]);
            }


            $payment = Pembayaran::create([
                "id" => (string) Str::uuid(),
                "pesanan_perbaikan_id" => $orderId,
                "metode_pembayaran" => $request["metode_pembayaran"],
                "payment_link" => $snapToken,
                "status_pembayaran" => "Belum Dibayar"
            ]);

            // Tambahkan relasi kendaraan untuk respons
            $pesanan->load('kendaraan:id,nama_kendaraan,plat_nomor');

            DB::commit();
            return $this->successResponse([
                "data" => $pesanan,
                "payment_data" => $payment,
            ], 'Pesanan perbaikan berhasil ditambahkan', 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal menambahkan pesanan perbaikan', $e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $pesanan = Pesanan_Perbaikan::with(['kendaraan:id,user_id,nama_kendaraan,plat_nomor,tahun_produksi,warna'])
                ->findOrFail($id);

            // Tambahkan informasi pemilik kendaraan
            $pesanan->kendaraan->load('user:id,name,email');

            // Pengguna biasa hanya dapat melihat pesanan mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pesanan->kendaraan->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk melihat detail pesanan perbaikan', null, 403);
                }
            }

            // Hitung durasi perbaikan jika sudah selesai
            if ($pesanan->status === 'selesai' && $pesanan->tanggal_masuk && $pesanan->tanggal_selesai) {
                $startDate = Carbon::parse($pesanan->tanggal_masuk);
                $endDate = Carbon::parse($pesanan->tanggal_selesai);
                $pesanan->durasi_perbaikan = $startDate->diffInDays($endDate) . ' hari';
            }

            $pembayaran = Pembayaran::where("pesanan_perbaikan_id", "=", $pesanan["pesanan_perbaikan_id"]);

            return $this->successResponse([
                "kendaraan_pelanggan_id" => $pesanan["kendaraan_pelanggan_id"],
                "tanggal_masuk" => $pesanan["tanggal_masuk"],
                "tanggal_perbaikan" => $pesanan["tanggal_perbaikan"],
                "tanggal_selesai" => $pesanan["tanggal_selesai"],
                "total_biaya" => $pesanan["total_biaya"],
                "status" => $pesanan["status"],
                "keterangan" => $pesanan["keterangan"],
                "payment_data" => $pembayaran
            ], 'Detail pesanan perbaikan berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->errorResponse('Pesanan perbaikan tidak ditemukan', "ID pesanan tidak valid: {$id}", 404);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil detail pesanan perbaikan', $e->getMessage(), 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pesanan_Perbaikan $pesanan_Perbaikan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            DB::beginTransaction();

            $pesanan = Pesanan_Perbaikan::findOrFail($id);

            //Pengguna biasa tidak dapat memperbarui pesanan perbaikan
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                return $this->errorResponse('Pengguna tidak diizinkan untuk mengubah pesanan perbaikan', null, 403);
            }

            $request->validate([
                'kendaraan_pelanggan_id' => 'required|uuid|exists:kendaraans,id',
                'tanggal_masuk' => 'required|date',
                'tanggal_perbaikan' => 'nullable|date|after_or_equal:tanggal_masuk',
                'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_perbaikan',
                'metode_pembayaran' => 'sometimes|in:cash,transfer',
                'total_biaya' => 'required|numeric|min:0',
                'status' => 'sometimes|in:menunggu,proses,selesai,batal',
                'keterangan' => 'nullable|string|max:1000',
            ]);

            // Validasi tanggal berdasarkan status
            if ($request->has('status')) {
                if ($request->status === 'proses' && !$request->has('tanggal_perbaikan') && !$pesanan->tanggal_perbaikan) {
                    $pesanan->tanggal_perbaikan = Carbon::now()->toDateString();
                }

                if ($request->status === 'selesai' && !$request->has('tanggal_selesai') && !$pesanan->tanggal_selesai) {
                    $pesanan->tanggal_selesai = Carbon::now()->toDateString();
                }
            }

            $orderId = $pesanan["id"];
            $pembayaran = Pembayaran::Where("pesanan_perbaikan_id", "=", $orderId);

            $data = [
                "kendaraan_pelanggan_id" => $request['kendaraan_pelanggan_id'],
                "status" => 'menunggu',
                "tanggal_masuk" => $request["tanggal_masuk"],
                "tanggal_perbaikan" => $request["tanggal_perbaikan"],
                "tanggal_selesai" => $request["tanggal_selesai"],
                "total_biaya" => $request["total_biaya"],
                "keterangan" => $request["keterangan"],
            ];

            if ($request["metode_pembayaran"] == "cash") {
                $snapToken = "";
            } else {
                $snapToken = $this->paymentService->initiatePayment([
                    'order_id' => $orderId,
                    'amount' => $data["total_biaya"],
                    'items' => [
                        [
                            'id' => 'Jasa Perbaikan',
                            'price' => $data["total_biaya"],
                            'quantity' => 1,
                            'name' => $data["keterangan"],
                        ],
                    ],
                ]);
            }


            $pembayaran->update([
                "metode_pembayaran" => $request["metode_pembayaran"],
            ]);

            $pesanan->update($request->all());

            // Reload dengan kendaraan
            $pesanan->load('kendaraan:id,nama_kendaraan,plat_nomor');

            DB::commit();
            return $this->successResponse($pesanan, 'Pesanan perbaikan berhasil diperbarui');
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->errorResponse('Validasi gagal', $e->errors(), 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal mengupdate pesanan perbaikan', $e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $pesanan = Pesanan_Perbaikan::findOrFail($id);

            // Hanya admin yang dapat menghapus pesanan perbaikan
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                return $this->errorResponse('Tidak diizinkan untuk menghapus pesanan', null, 403);
            }

            // Cegah penghapusan pesanan yang sudah selesai untuk tujuan audit
            if ($pesanan->status === 'selesai') {
                return $this->errorResponse(
                    'Tidak dapat menghapus pesanan yang telah selesai',
                    'Pesanan yang telah selesai tidak dapat dihapus untuk keperluan audit',
                    422
                );
            }

            $pesanan->delete();

            DB::commit();
            return $this->successResponse(null, 'Pesanan perbaikan berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal menghapus pesanan perbaikan', $e->getMessage(), 500);
        }
    }

    public function cancelOrder($id)
    {
        try {
            DB::beginTransaction();

            $pesanan = Pesanan_Perbaikan::with('kendaraan')->findOrFail($id);

            // Cek jika pengguna ini pemilik kendaraan ini
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $pesanan->kendaraan->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk membatalkan pesanan ini', null, 403);
                }
            }

            // Hanya izinkan pembatalan pesanan yang berstatus 'menunggu'
            if ($pesanan->status !== 'menunggu') {
                return $this->errorResponse(
                    'Tidak dapat membatalkan pesanan',
                    'Hanya pesanan dengan status menunggu yang dapat dibatalkan',
                    422
                );
            }

            $pesanan->status = 'batal';
            $pesanan->save();

            DB::commit();
            return $this->successResponse($pesanan, 'Pesanan perbaikan berhasil dibatalkan');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Gagal membatalkan pesanan', $e->getMessage(), 500);
        }
    }

    public function getPerbaikanKendaraan($kendaraanId)
    {
        try {
            $kendaraan = Kendaraan::findOrFail($kendaraanId);

            // Pengguna biasa hanya dapat melihat perbaikan kendaraannya sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User') {
                if (Auth::id() !== $kendaraan->user_id) {
                    return $this->errorResponse('Tidak diizinkan untuk melihat riwayat perbaikan kendaraan ini', null, 403);
                }
            }

            $pesanans = Pesanan_Perbaikan::where('kendaraan_pelanggan_id', $kendaraanId)
                ->orderBy('tanggal_masuk', 'desc')
                ->paginate(10);

            return $this->paginationResponse($pesanans, 'Riwayat perbaikan kendaraan berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil riwayat perbaikan kendaraan', $e->getMessage(), 500);
        }
    }

    public function getPerbaikanUser($userId = null)
    {
        try {
            // Jika tidak ada userId yang diberikan, gunakan pengguna yang diautentikasi
            if (!$userId) {
                $userId = Auth::id();
            }

            // Pengguna biasa hanya dapat melihat perbaikan mereka sendiri
            if (Auth::guard('sanctum')->user()->tokenable_type === 'App\\Models\\User' && $userId != Auth::id()) {
                return $this->errorResponse('Tidak diizinkan untuk melihat riwayat perbaikan pengguna lain', null, 403);
            }

            $kendaraanIds = Kendaraan::where('user_id', $userId)->pluck('id');

            $pesanans = Pesanan_Perbaikan::whereIn('kendaraan_pelanggan_id', $kendaraanIds)
                ->with(['kendaraan:id,nama_kendaraan,plat_nomor,warna,tahun_produksi'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            // Tambahkan statistik ringkasan untuk pengguna
            $stats = [
                'total_pesanan' => Pesanan_Perbaikan::whereIn('kendaraan_pelanggan_id', $kendaraanIds)->count(),
                'pesanan_aktif' => Pesanan_Perbaikan::whereIn('kendaraan_pelanggan_id', $kendaraanIds)
                    ->whereIn('status', ['menunggu', 'proses'])
                    ->count(),
                'total_biaya' => Pesanan_Perbaikan::whereIn('kendaraan_pelanggan_id', $kendaraanIds)
                    ->where('status', 'selesai')
                    ->sum('total_biaya')
            ];

            return $this->paginationResponse($pesanans, 'Riwayat perbaikan pengguna berhasil diambil', $stats);
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil riwayat perbaikan pengguna', $e->getMessage(), 500);
        }
    }

    public function getStatisticsPerbaikan()
    {
        try {
            $now = Carbon::now();
            $firstDayOfMonth = $now->copy()->startOfMonth();
            $lastDayOfMonth = $now->copy()->endOfMonth();

            $stats = [
                'ringkasan' => [
                    'total_pesanan' => Pesanan_Perbaikan::count(),
                    'menunggu' => Pesanan_Perbaikan::where('status', 'menunggu')->count(),
                    'proses' => Pesanan_Perbaikan::where('status', 'proses')->count(),
                    'selesai' => Pesanan_Perbaikan::where('status', 'selesai')->count(),
                    'batal' => Pesanan_Perbaikan::where('status', 'batal')->count(),
                ],
                'keuangan' => [
                    'pendapatan_total' => Pesanan_Perbaikan::where('status', 'selesai')->sum('total_biaya'),
                    'pendapatan_bulan_ini' => Pesanan_Perbaikan::where('status', 'selesai')
                        ->whereBetween('tanggal_selesai', [$firstDayOfMonth, $lastDayOfMonth])
                        ->sum('total_biaya'),
                    'rata_rata_biaya' => Pesanan_Perbaikan::where('status', 'selesai')->avg('total_biaya') ?: 0,
                ],
                'performa' => [
                    'rata_rata_waktu_tunggu' => DB::select("
                        SELECT AVG(DATEDIFF(tanggal_perbaikan, tanggal_masuk)) as avg_wait_time 
                        FROM pesanan__perbaikans 
                        WHERE tanggal_perbaikan IS NOT NULL
                    ")[0]->avg_wait_time ?: 0,
                    'rata_rata_waktu_perbaikan' => DB::select("
                        SELECT AVG(DATEDIFF(tanggal_selesai, tanggal_perbaikan)) as avg_repair_time 
                        FROM pesanan__perbaikans 
                        WHERE tanggal_selesai IS NOT NULL AND tanggal_perbaikan IS NOT NULL
                    ")[0]->avg_repair_time ?: 0,
                ],
                'tren_bulanan' => $this->getTrendBulanan()
            ];

            return $this->successResponse($stats, 'Statistik perbaikan berhasil diambil');
        } catch (\Exception $e) {
            return $this->errorResponse('Gagal mengambil statistik perbaikan', $e->getMessage(), 500);
        }
    }

    private function getTrendBulanan()
    {
        $result = [];
        $now = Carbon::now();

        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $startOfMonth = $month->copy()->startOfMonth();
            $endOfMonth = $month->copy()->endOfMonth();

            $monthData = [
                'bulan' => $month->format('M Y'),
                'total_pesanan' => Pesanan_Perbaikan::whereBetween('tanggal_masuk', [$startOfMonth, $endOfMonth])->count(),
                'pesanan_selesai' => Pesanan_Perbaikan::whereBetween('tanggal_selesai', [$startOfMonth, $endOfMonth])
                    ->where('status', 'selesai')->count(),
                'pendapatan' => Pesanan_Perbaikan::whereBetween('tanggal_selesai', [$startOfMonth, $endOfMonth])
                    ->where('status', 'selesai')->sum('total_biaya'),
            ];

            $result[] = $monthData;
        }

        return $result;
    }
}
