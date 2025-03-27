import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "@/utils/constans";
import { useLocalSearchParams } from "expo-router";
import Detail from "@/components/Molecules/Detail";
import { clampString, formatCurrency } from "@/utils/strings";
import { console_dev } from "@/utils/development";

export default function historyDetail() {
  const { instance } = useLocalSearchParams();

  const [data, setData] = useState<Record<string, string>>();

  useEffect(() => {
    if (instance) {
      setData(JSON.parse(instance as string));
    }
  }, []);

  // useEffect(() => console_dev(data.kendaraan.plat_nomor), [data])

  return (
    <Detail title="Nota Pembayaran">
      <View style={styles.header}>
        <View
          style={{
            borderRadius: "100%",
            padding: 20,
            backgroundColor: "green",
          }}
        >
          <MaterialIcons name="check" size={28} color="white" />
        </View>

        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            marginTop: 20,
            color: "#636363",
          }}
        >
          {data?.status ?? "Tidak diketauhii"}
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
            {data ? (data?.kendaraan as unknown as { plat_nomor: string }).plat_nomor : ""}
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
      </View>

      {/* <View
        style={{
          width: SCREEN_WIDTH,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          left: 0,
          paddingVertical: 10,
        }}
      >
        <Pressable style={styles.download}>
          <MaterialIcons name="download" color="white" size={20} />
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: 500 }}
          >
            Download Struk
          </Text>
        </Pressable>
      </View> */}
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
