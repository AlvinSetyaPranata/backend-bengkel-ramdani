import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, LinkProps } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";


interface propsType {
    link: LinkProps["href"]
}

export default function FloatButton({ link }: propsType) {
  return (
    <Link href="/addTransportation" style={styles.fab}>
      <View style={styles.fab}>
        <MaterialIcons name="add" size={20} color="white" />
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: "10%",
        bottom: "15%",
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
        zIndex: 20,
      },
});
