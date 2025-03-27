import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Form from "@/components/Molecules/Form";
import { z } from "zod";
import * as Yup from "yup";
import Detail from "@/components/Molecules/Detail";
import { Formik } from "formik";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";
import { Image } from "expo-image";

export default function transporatationDetail() {
  const { instance } = useLocalSearchParams();

  const [data, setData] = useState()
  const excluded_field = ["user", "is_owner", "user_id", "id", "gambar_kendaraan"]

  useEffect(() => {
    if (instance) {
      setData(JSON.parse((instance as string)))
    }
  }, [])


  return (
    <Detail title="Detail Transportasi">
      <View style={styles.content}>
        <View style={styles.wrapper}>
          {data && Object.entries(data)
            .filter(([key,]) => !excluded_field.includes(key))
            .map(([key, value], index) => (
              <View style={styles.field} key={index}>
                <Text style={styles.title}>{key}</Text>
                <Text>{value}</Text>
              </View>
            ))}
            <View style={styles.field}>
                <Text style={styles.title}>Gambar Kendaraan</Text>
                { data ? 
                  (
                    <Image source={data.gambar_kendaraan} style={{ width: 100, height: 100}} placeholder='|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['/>
                  )  

                  : 
                  (
                    <Text>Tidak tersedia</Text>
                  )
              }
              </View>
        </View>
      </View>
    </Detail>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 10,
  },

  wrapper: {
    rowGap: 20,
  },

  field: {
    rowGap: 10,
  },

  title: {
    fontWeight: "500",
    fontSize: 16,
  },
});
