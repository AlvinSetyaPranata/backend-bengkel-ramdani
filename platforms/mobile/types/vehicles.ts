interface User {
    id: string;
    name: string;
}

interface Vehicle {
    id: string;
    user_id: string;
    nama_kendaraan: string;
    plat_nomor: string;
    tahun_produksi: string;
    warna: string;
    gambar_kendaraan: string;
    is_owner: boolean;
    user: User;
}
