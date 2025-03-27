import { FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Detail from "@/components/Molecules/Detail";
import FloatButton from "@/components/Atoms/FloatButton";
import { createColumnHelper } from "@tanstack/react-table";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";
import { useRootNavigationState, useRouter } from "expo-router";
import ListItem from "@/components/Atoms/ListItem";


export default function Transportation() {
  const router = useRouter()
  const columnHelper = createColumnHelper<Vehicle>();
  const { token } = useStore(tokenStore);
  const navigation = useRootNavigationState();

  
  const [data, setData] = useState<Record<string, string>[]>([{}]);

  useEffect(() => {

    console.log("Transport")
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


  return (
    <Detail title="Data Transportasi">

      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            instance={item}
            id={item.id}
            href="/transportationDetail"
            title={item.nama_kendaraan}
            desc={item.plat_nomor}
          />
        )}
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
