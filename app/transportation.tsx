import { StyleSheet } from "react-native";
import React from "react";
import Detail from "@/components/Molecules/Detail";
import FloatButton from "@/components/Atoms/FloatButton";
import TableList from "@/components/TableList";

export default function Transportation() {
  const columns = [
    { name: "merek_kendaraan", label: "Merek Mobil" },
    { name: "warna_kendaraan", label: "Warna Mobil" },
    { name: "plat_nomor", label: "Plat Nomor" },
    { name: "tahun_produksi", label: "Tahun Produksi" },
    { name: "gambar_kendaraan", label: "Gambar Mobil" },
  ];

  const data = [
    {
      id: "1",
      merek_kendaraan: "Avanza",
      warna_kendaraan: "Putih",
      plat_nomor: "B 1234 ABC",
      tahun_produksi: 2018,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "2",
      merek_kendaraan: "Honda Civic",
      warna_kendaraan: "Hitam",
      plat_nomor: "D 5678 XYZ",
      tahun_produksi: 2020,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "3",
      merek_kendaraan: "Toyota Corolla",
      warna_kendaraan: "Biru",
      plat_nomor: "F 9101 DEF",
      tahun_produksi: 2019,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "4",
      merek_kendaraan: "Suzuki Ertiga",
      warna_kendaraan: "Merah",
      plat_nomor: "G 2345 HIJ",
      tahun_produksi: 2021,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "5",
      merek_kendaraan: "Mitsubishi Pajero",
      warna_kendaraan: "Abu-abu",
      plat_nomor: "H 6789 KLM",
      tahun_produksi: 2017,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "6",
      merek_kendaraan: "Daihatsu Xenia",
      warna_kendaraan: "Silver",
      plat_nomor: "J 1122 NOP",
      tahun_produksi: 2016,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "7",
      merek_kendaraan: "Ford Everest",
      warna_kendaraan: "Hijau",
      plat_nomor: "K 3344 QRS",
      tahun_produksi: 2022,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "8",
      merek_kendaraan: "Nissan X-Trail",
      warna_kendaraan: "Coklat",
      plat_nomor: "L 5566 TUV",
      tahun_produksi: 2015,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D-trail",
    },
    {
      id: "9",
      merek_kendaraan: "Mazda CX-5",
      warna_kendaraan: "Kuning",
      plat_nomor: "M 7788 WXY",
      tahun_produksi: 2023,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D-5",
    },
    {
      id: "10",
      merek_kendaraan: "BMW X5",
      warna_kendaraan: "Hitam Metalik",
      plat_nomor: "N 9900 ZAB",
      tahun_produksi: 2020,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "11",
      merek_kendaraan: "Mercedes-Benz GLC",
      warna_kendaraan: "Biru Tua",
      plat_nomor: "P 1234 CDE",
      tahun_produksi: 2019,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "12",
      merek_kendaraan: "Hyundai Creta",
      warna_kendaraan: "Oranye",
      plat_nomor: "Q 5678 FGH",
      tahun_produksi: 2021,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "13",
      merek_kendaraan: "Kia Seltos",
      warna_kendaraan: "Putih Mutiara",
      plat_nomor: "R 9101 IJK",
      tahun_produksi: 2022,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "14",
      merek_kendaraan: "Tesla Model 3",
      warna_kendaraan: "Merah Maroon",
      plat_nomor: "S 2345 LMN",
      tahun_produksi: 2023,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D-3",
    },
    {
      id: "15",
      merek_kendaraan: "Subaru Forester",
      warna_kendaraan: "Hijau Army",
      plat_nomor: "T 6789 OPQ",
      tahun_produksi: 2018,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "16",
      merek_kendaraan: "Jeep Wrangler",
      warna_kendaraan: "Kuning Neon",
      plat_nomor: "U 1122 RST",
      tahun_produksi: 2020,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "17",
      merek_kendaraan: "Volkswagen Polo",
      warna_kendaraan: "Biru Laut",
      plat_nomor: "V 3344 UVW",
      tahun_produksi: 2019,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "18",
      merek_kendaraan: "Chevrolet Captiva",
      warna_kendaraan: "Silver Tua",
      plat_nomor: "W 5566 XYZ",
      tahun_produksi: 2017,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "19",
      merek_kendaraan: "Peugeot 3008",
      warna_kendaraan: "Hitam Glossy",
      plat_nomor: "X 7788 ABC",
      tahun_produksi: 2021,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: "20",
      merek_kendaraan: "Audi Q5",
      warna_kendaraan: "Abu-abu Gelap",
      plat_nomor: "Y 9900 DEF",
      tahun_produksi: 2022,
      gambar_kendaraan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcnxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  return (
    <Detail title="Data Transportasi">
      <FloatButton link="/addTransportation" />
      <TableList
        columns={columns}
        data={data}
        detailLink="/transportationDetail"
        onlyShow={["merek_kendaraan", "warna_kendaraan"]}
      />
    </Detail>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 20,
  },

  back: {
    position: "absolute",
    left: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
});
