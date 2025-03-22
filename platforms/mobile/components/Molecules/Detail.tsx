import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { PropsWithChildren } from "react";


interface propsType extends  PropsWithChildren {
  title: string,
  fallback_screen?: Href
}

export default function Detail({ title, children, fallback_screen="/" }: propsType) {
  const router = useRouter();

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.canGoBack() ? router.back() : router.navigate(fallback_screen)}>
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
    paddingTop: '5%',
    backgroundColor: 'white'
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
