// NOTE: Integrate with TableList component


import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Detail from "@/components/Molecules/Detail";
import FloatButton from "@/components/Atoms/FloatButton";
import TableList from "@/components/TableList";

export default function Transportation() {
  
  return (
    <Detail title="Data Transportasi">
      <FloatButton link="/addTransportation" />
      <TableList  />
    </Detail>
  );
}

const styles = StyleSheet.create({

  content: {
    paddingVertical: 20
  },

  back: {
    position: "absolute",
    left: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: 500,
    textAlign: "center",
  },
});
