import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

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
    <View style={{ flex: 1 }}>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item id={item.id} brand={item.brand} owner={item.owner} />
        )}/>
        <Link href="/addTransportation" style={styles.fab}>
            <View style={styles.fab}>
              <MaterialIcons name="add" size={20} color="white"/>
            </View>
          </Link>
    </View>
  );
}

const styles = StyleSheet.create({

  fab: {
    position: "absolute",
    right: '10%',
    bottom: '15%',
    backgroundColor: "#0067A5",
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 20
  }
});
