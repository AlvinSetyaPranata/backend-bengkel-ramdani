import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "@/utils/constans";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import Detail from "@/components/Molecules/Detail";
import { clampString, formatCurrency } from "@/utils/strings";
import { console_dev } from "@/utils/development";
import RefreshLayout from "@/components/Molecules/RefreshLayout";
import WebView from "react-native-webview";




export default function historyDetail() {
  const { instance } = useLocalSearchParams();
  const router = useRouter()

  const [data, setData] = useState<Record<string, string>>();

  const handlePayment = () => {
      router.push({
        pathname: "/midtrans",
        params: { token: data?.token_pembayaran }
      })
  }

  useEffect(() => {
    if (instance) {
      setData(JSON.parse(instance as string));
    }
  }, []);

  // useEffect(() => console_dev(data), [data])

  return (
    <Detail title="Nota Pembayaran">
      <RefreshLayout>
        <View style={styles.header}>
          <View
            style={{
              borderRadius: "100%",
              padding: 20,
              backgroundColor: data?.status_pembayaran == "Lunas" ? "green" : "red",
            }}
          >
            <MaterialIcons name={data?.status_pembayaran == "Lunas" ? "check" : "close"} size={28} color="white" />
          </View>

          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              marginTop: 20,
              color: "#636363",
            }}
          >
            {data?.status_pembayaran ?? "Tidak diketauhii"}
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 6,
              color: "black",
            }}
          >
            {formatCurrency(data?.total_biaya ?? "0")}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.detailWrapper}>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              ID Pesanan
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              {clampString(data?.id ?? "-")}
            </Text>
          </View>
          <View style={styles.detailWrapper}>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              Nama Kendaraan
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              {(data?.kendaraan as unknown as { nama_kendaraan: string })
                ?.nama_kendaraan ?? ""}
            </Text>
          </View>
          <View style={styles.detailWrapper}>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              Plat Nomor
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              {data
                ? (data?.kendaraan as unknown as { plat_nomor: string })
                    .plat_nomor
                : ""}
            </Text>
          </View>
          <View style={styles.detailWrapper}>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              Tanggal Masuk
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              {data?.tanggal_masuk ?? ""}
            </Text>
          </View>
          <View style={styles.detailWrapper}>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              Metode Pembayaran
            </Text>
            <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
              {data?.metode_pembayaran ?? ""}
            </Text>
          </View>

          {data?.status_pembayaran == "Belum Dibayar" && 
          <Pressable onPress={handlePayment} style={{ width: "100%", backgroundColor: "black", borderRadius: 10, paddingVertical: 10, marginTop: 50}}>
            <Text style={{color: "white", fontWeight: "500", textAlign: "center"}}>Bayar Sekarang</Text>
          </Pressable>
          }
        </View>
      </RefreshLayout>
    </Detail>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },

  header: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },

  contentContainer: {
    borderTopWidth: 0.5,
    borderColor: "#8c8c8c",
    rowGap: 15,
    paddingVertical: 20,
    marginTop: 20,
  },

  detailWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  download: {
    flexDirection: "row",
    columnGap: 10,
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 15,
    alignSelf: "center",
  },
});
