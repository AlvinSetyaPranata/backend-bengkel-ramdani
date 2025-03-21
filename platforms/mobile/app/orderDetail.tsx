import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Detail from "@/components/Molecules/Detail";
import { SCREEN_WIDTH } from "@/utils/constans";
import { clampString, formatCurrency } from "@/utils/strings";
import { console_dev } from "@/utils/development";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";

export default function orderDetail() {
  const [data, setData] = useState<Record<string, string>>();
  const { token } = useStore(tokenStore)

  const [pending, setPending] = useState(false)

  const { instance }: { instance: string } = useLocalSearchParams();


  const onCancelOrder = async () => {
    if (data) {
      setPending(true)
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/pesanan/${data.id}/cancel`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      setPending(false)
      if (res.status == 422) {
        const resBody = await res.json()

        alert(resBody.errors)
        return
      }

      if (!res.ok) {
        alert("Gagal membatalkan pesanan")
        console_dev(await res.json())
        return
      }

      alert("Berhasil membatalkan pesanan")
      
      if (!router.canGoBack()) {
        router.replace("/")
        return
      }
      
      router.back()
      
    }
  }

  useEffect(() => {
    if (instance) {
      const parsed = JSON.parse(instance);
      setData(parsed);
    }
  }, []);

  return (
    <Detail title="Detail Pesanan">

      <View style={styles.contentContainer}>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>ID Pesanan:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {clampString(data?.id ?? "")}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Tanggal Masuk:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {data?.tanggal_masuk ?? ""}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Tanggal Perbaikan:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {data?.tanggal_perbaikan ?? ""}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Tanggal Selesai:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {data?.tanggal_selesai ?? ""}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Total Biaya:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {formatCurrency(data?.total_biaya ?? "")}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Tanggal Selesai:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {
              (data?.kendaraan as unknown as { nama_kendaraan: string })
                ?.nama_kendaraan
            }
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Plat Nomor:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {(data?.kendaraan as unknown as { plat_nomor: string })?.plat_nomor}
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={styles.label}>Keterangan:</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 14, marginTop: 6, color: "black" }}
          >
            {data?.status ?? ""}
          </Text>
        </View>
      </View>

      <View
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
        <Pressable style={styles.cancel} onPress={onCancelOrder}>
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: 500 }}
          >
            {pending ? "Membatalkan Pesanan" : "Batalkan Pesanan"}
          </Text>
        </Pressable>
      </View>
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
    rowGap: 15,
    paddingVertical: 30,
  },

  detailWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: { fontSize: 15, marginTop: 6, color: "black", fontWeight: "500" },

  cancel: {
    flexDirection: "row",
    columnGap: 10,
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 15,
    alignSelf: "center",
  },
  
});
