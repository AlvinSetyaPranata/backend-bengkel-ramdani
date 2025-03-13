import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Form from '@/components/Molecules/Form'
import { z } from 'zod'
import Detail from '@/components/Molecules/Detail'

export default function transporatationDetail() {
    const {__EXPO_ROUTER_key, ...data} = useLocalSearchParams()

    const schema = z.object({
      merek_kendaraan: z.string().min(1, "Harap diisi"),
      warna_kendaraan: z.string().min(1, "Harap diisi"),
      plat_nomor: z.string().min(1, "Harap diisi"),
      gambar_kendaraan: z.string().min(1, "Harap diisi"),
      tahun_produksi: z.string().min(1, "Harap diisi")
    })

    const structure = {
      merek_kendaraan: ["", "Merek Kendaraan", "merek_kendaraan"],
      warna_kendaraan: ["", "Warna Kendaraan", "warna_kendaraan"],
      plat_nomor: ["", "Plat Nomor", "plat_nomor"],
      gambar_kendaraan: ["image", "Gambar Kendaraan", "gambar_kendaraan"],
      tahun_produksi: ["datetime", "Tahun Produksi", "tahun_produksi"]
    }

    // useEffect(() => console.log(data), [])

  return (
    <Detail title='Edit Transportasi'>
      <View style={styles.content}>
      <Form structure={structure} schema={schema} defaultValue={data} addButtonTitle='Perbarui Transportasi'/>
      </View>
    </Detail>
  )
}

const styles = StyleSheet.create({

  content: {
    paddingVertical: 10
  }

})