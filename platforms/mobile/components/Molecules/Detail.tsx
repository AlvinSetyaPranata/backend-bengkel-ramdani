import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { PropsWithChildren } from "react";


interface propsType extends  PropsWithChildren {
  title: string,
  fallback_screen?: Href,
  force_redirect_to?: Href|""
}

export default function Detail({ title, children, fallback_screen="/", force_redirect_to="" }: propsType) {
  const router = useRouter();



  const getUrl = () => {
    if (force_redirect_to != "" || force_redirect_to) {
      router.navigate(force_redirect_to)
      return
    }

    if (router.canGoBack()) {
      router.back()
    } else {
      router.navigate(fallback_screen)
    }
  }

  
  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={getUrl}>
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
