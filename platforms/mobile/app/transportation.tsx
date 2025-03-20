import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Detail from "@/components/Molecules/Detail";
import FloatButton from "@/components/Atoms/FloatButton";
import Datatable from "@/components/Atoms/Datatable";
import { createColumnHelper } from "@tanstack/react-table";
import useVehicleQuery from "@/hooks/Queries/useVehiclesQuery";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";
import { useRootNavigationState, useRouter } from "expo-router";


export default function Transportation() {
  const router = useRouter()
  const columnHelper = createColumnHelper<Vehicle>();
  const { token } = useStore(tokenStore);
  const navigation = useRootNavigationState();

  
  const [data, setData] = useState({})

  useEffect(() => {

    if (navigation.key) {
      if (!token || token == "") {
        router.replace("/login")
        return
      }
    }

    const getData = async () => {


      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/kendaraan`, { headers: {
        Authorization: `Bearer ${token}`
      }});

      const data = await res.json()
      setData(data.data)
      
    };

    getData();
  }, []);


  const columns = [
    columnHelper.accessor("nama_kendaraan", {
      header: "Nama Kendaraan",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("plat_nomor", {
      header: "Plat Nomor",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("warna", {
      header: "Warna",
      cell: (info) => info.getValue(),
    }),
  ];

  return (
    <Detail title="Data Transportasi">
      <FloatButton link="/addTransportation" />

      <Datatable data={data || []} columns={columns} />
  
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
