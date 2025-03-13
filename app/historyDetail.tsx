import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "@/utils/constans";
import { useNavigation } from "expo-router";

export default function historyDetail() {
    const navigation = useNavigation()

  return (
    <View style={styles.container}>
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
          Pembayaan Berhasil
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 6,
            color: "black",
          }}
        >
          RP. 20.000
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.detailWrapper}>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            ID Pesanan
          </Text>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>1</Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            Metode Pembayaran
          </Text>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            Cash
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            Waktu Pembayaran
          </Text>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            2022-02-01
          </Text>
        </View>
        <View style={styles.detailWrapper}>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            Nama Pengguna
          </Text>
          <Text style={{ fontSize: 14, marginTop: 6, color: "black" }}>
            Alvin Setya Pra...
          </Text>
        </View>
      </View>

      <View
        style={{
            width: SCREEN_WIDTH,  
            justifyContent: 'center', 
            alignItems: 'center',
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            paddingBottom: 10
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 10,
    flex: 1,
  },

  icon: {
    width: 24,
    height: 24,
  },

  header: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 42,
  },

  contentContainer: {
    borderTopWidth: 0.5,
    borderColor: "#8c8c8c",
    rowGap: 15,
    paddingVertical: 20,
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
