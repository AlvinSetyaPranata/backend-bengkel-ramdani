import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ListItem from "@/components/Atoms/ListItem";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";
import Detail from "@/components/Molecules/Detail";

export default function History() {

  const [data, setData] = useState<Record<string, string>[]>([{}]);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { token } = useStore(tokenStore);


  const refresher = useCallback(() => {
    setIsRefreshing(true)

    setTimeout(() => setIsRefreshing(false), 1000)
  }, [])

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_API_URL}/pesanan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setData(data.data);
    };

    getData();
  }, []);

  return (
    <Detail title="Histori Perbaikan">


      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        refreshControl={<RefreshControl onRefresh={refresher} refreshing={isRefreshing} />}
        renderItem={({ item }) => (
          <ListItem
          instance={item}
          id={item.id}
          href="/historyDetail"
          title={
            (item as { kendaraan?: { nama_kendaraan: string } })?.kendaraan
            ?.nama_kendaraan ?? "Unknown"
          }
          desc={item.tanggal_selesai}
          />
        )}
        />
    </Detail>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
  },
});
