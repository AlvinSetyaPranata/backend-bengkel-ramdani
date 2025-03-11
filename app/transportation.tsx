import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { Link, useRouter } from "expo-router";

export default function Transportation() {
  const DATA = [
    { id: "1", brand: "Merek Mobil", owner: "Warna Mobil" },
    { id: "2", brand: "Toyota Supra", owner: "Putih" },
    { id: "3", brand: "Pajero Sport", owner: "Hitam" },
  ];

  const router = useRouter()


  const Item = ({
    id,
    brand,
    owner,
  }: {
    id: string;
    brand: string;
    owner: string;
  }) => (
      <Pressable
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: id == "1" ? "black" : "white",
        }}
        onPress={() => router.push({ pathname: id!="1" ? "/transportationDetail" : "/transportation", params: {id: id}})}
      >
        <Text style={{ fontSize: 14, color: id == "1" ? "white" : "black" }}>
          {brand}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: id == "1" ? "white" : "black",
            fontWeight: "500",
          }}
        >
          {owner}
        </Text>
      </Pressable>
  );

  return (
    <View>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item id={item.id} brand={item.brand} owner={item.owner} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
