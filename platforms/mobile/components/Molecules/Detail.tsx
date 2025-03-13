import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { PropsWithChildren } from "react";


interface propsType extends  PropsWithChildren {
  title: string
}

export default function Detail({ title, children }: propsType) {
  const navigation = useNavigation();

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={22} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        {children}
      </View>
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '10%'
  },

  back: {
    position: "absolute",
    left: 10,
    top: 0,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 32
  }
});
