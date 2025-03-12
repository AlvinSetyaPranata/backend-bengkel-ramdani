import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";

export default function History() {

  const navigation = useNavigation()

  const [data] = useState([
    {
      id: "1",
      name: "Servis Body lecet",
      price: "200.000",
      date: "12 Maret 2025",
    },
    {
      id: "2",
      name: "Ganti Oli Mesin",
      price: "150.000",
      date: "11 Maret 2025",
    },
    {
      id: "3",
      name: "Servis Rem Cakram",
      price: "250.000",
      date: "10 Maret 2025",
    },
    { id: "4", name: "Tune Up Mesin", price: "300.000", date: "9 Maret 2025" },
    { id: "5", name: "Balancing Roda", price: "100.000", date: "8 Maret 2025" },
    { id: "6", name: "Spooring Roda", price: "180.000", date: "7 Maret 2025" },
    { id: "7", name: "Ganti Busi", price: "80.000", date: "6 Maret 2025" },
    { id: "8", name: "Cuci Mesin", price: "120.000", date: "5 Maret 2025" },
    {
      id: "9",
      name: "Poles Body Mobil",
      price: "220.000",
      date: "4 Maret 2025",
    },
    {
      id: "10",
      name: "Servis Radiator",
      price: "270.000",
      date: "3 Maret 2025",
    },
    {
      id: "11",
      name: "Ganti Kampas Rem",
      price: "200.000",
      date: "2 Maret 2025",
    },
    {
      id: "12",
      name: "Servis AC Mobil",
      price: "350.000",
      date: "1 Maret 2025",
    },
    {
      id: "13",
      name: "Flushing Oli Transmisi",
      price: "400.000",
      date: "29 Februari 2025",
    },
    {
      id: "14",
      name: "Ganti Filter Udara",
      price: "90.000",
      date: "28 Februari 2025",
    },
    {
      id: "15",
      name: "Ganti Filter Oli",
      price: "110.000",
      date: "27 Februari 2025",
    },
    {
      id: "16",
      name: "Ganti Wiper",
      price: "75.000",
      date: "26 Februari 2025",
    },
    {
      id: "17",
      name: "Servis Power Steering",
      price: "320.000",
      date: "25 Februari 2025",
    },
    {
      id: "18",
      name: "Servis Shockbreaker",
      price: "280.000",
      date: "24 Februari 2025",
    },
    { id: "19", name: "Ganti Aki", price: "500.000", date: "23 Februari 2025" },
    { id: "20", name: "Ganti Ban", price: "600.000", date: "22 Februari 2025" },
  ]);

  const handleClick = (id: string, name: string, price: string) => navigation.navigate("historyDetail", { id: id, name: name, price: price})

  const Item = ({
    id,
    name,
    price,
  }: {
    id: string;
    name: string;
    price: string;
  }) => (
    <Pressable
      onPress={() => handleClick(id)}
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
      <View>
        <Text style={{ fontSize: 17, fontWeight: "500" }}>{name}</Text>
        <Text style={{ fontSize: 12, marginTop: 6 }}>12 Desember 2024</Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          color: "black",
        }}
      >
        Rp.{price}
      </Text>
    </Pressable>
  );

  return (
    <View>
      <View style={styles.header}></View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item id={item.id} name={item.name} price={item.price} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
  },
});
