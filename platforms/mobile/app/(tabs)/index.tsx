import { ThemedView } from "@/components/ThemedView";
import { SCREEN_HEIGHT } from "@/utils/constans";
import { useRouter, useRootNavigationState } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { ColumnDef } from "@tanstack/react-table";
import Datatable from "@/components/Atoms/Datatable";
import useVehicleQuery from "@/hooks/Queries/useVehiclesQuery";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
useVehicleQuery;

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useRootNavigationState();

  // const { data, isLoading, error } = useVehicleQuery();
  const [data, setData] = useState({});

  const { token } = useStore(tokenStore);

  const handleActionClicked = (selectedData) => {
    router.replace({
      pathname: "/orderDetail",
      params: { instance: JSON.stringify(selectedData) },
    });
  };

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
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <Text style={{ textTransform: "capitalize", textAlign: "center" }}>
          {getValue() as string}
        </Text>
      ),
    },
    {
      header: "Aksi",
      cell: ({ row }) => (
        <Pressable onPress={() => handleActionClicked(row.original)}>
          <MaterialIcons name="chevron-right" size={20} />
        </Pressable>
      ),
    },
  ];

  useEffect(() => {
    if (navigation.key) {
      if (!token || token == "") {
        router.replace("/login");
        return;
      }
    }
  }, [navigation.key]);

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
