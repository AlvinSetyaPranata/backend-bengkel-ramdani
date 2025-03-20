import { ThemedView } from "@/components/ThemedView";
import { SCREEN_HEIGHT } from "@/utils/constans";
import { useRouter, useRootNavigationState } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { ColumnDef } from "@tanstack/react-table";
import Datatable from "@/components/Atoms/Datatable";
import useVehicleQuery from "@/hooks/Queries/useVehiclesQuery";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";
import { useEffect, useState } from "react";
useVehicleQuery;

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useRootNavigationState();
  // const { data, isLoading, error } = useVehicleQuery();
  const [data, setData] = useState({});

  const { token } = useStore(tokenStore);

  function getStatusColor(value: string) {
    switch (value) {
      case "menunggu":
        return "bg-blue-500 text-white";
      case "proses":
        return "bg-yellow-500 text-white";
      case "selesai":
        return "bg-green-500 text-white";
      case "batal":
        return "bg-red-500 text-white";
    }
  }

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

      // console.log(res)

      const data = await res.json();
      setData(data.data);
    };

    getData();
  }, []);

  const columns: ColumnDef<{
    tanggal_selesai: string;
    status: string;
  }>[] = [
    {
      accessorKey: "kendaraan.plat_nomor",
      header: "Plat Nomor",
      cell: ({ getValue }) => <Text>{getValue() as string}</Text>,
    },
    {
      accessorKey: "tanggal_selesai",
      header: "Tanggal Selesai",
      cell: ({ getValue }) => <Text>{getValue() as string}</Text>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <View
          style={{
            paddingVertical: 4,
            borderRadius: 5,
            backgroundColor: getStatusColor(getValue() as string),
          }}
        >
          <Text style={{ textTransform: "capitalize", textAlign: "center" }}>
            {getValue() as string}
          </Text>
        </View>
      ),
    },
  ];

  useEffect(() => {
    if (!token || token == "") {
      if (navigation.key) {
        router.replace("/login");
        return;
      }
    }
  }, [navigation.key])

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ThemedView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={{ fontWeight: "500", fontSize: 20 }}>Halo Alvin</Text>
          </View>

          <View style={{ marginTop: 50 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", marginBottom: 5 }}>
              Daftar pesanan anda
            </Text>
            {/* Datatable */}
            <Datatable columns={columns} data={data || []} />
          </View>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 15,
    minHeight: SCREEN_HEIGHT,
    flex: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
