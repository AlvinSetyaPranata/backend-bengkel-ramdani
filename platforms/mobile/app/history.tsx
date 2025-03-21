import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRootNavigationState, useRouter } from "expo-router";
import ListItem from "@/components/Atoms/ListItem";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";

export default function History() {

  
const router = useRouter()
  const navigation = useRootNavigationState()

 const [data, setData] = useState({})
  const { token } = useStore(tokenStore)


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
 }, [])

 

  

  return (
    <View>
      <View style={styles.header}></View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem id={item.id} href="historyDetail" title={item.name} desc={item.date} span={item.price}  />
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
