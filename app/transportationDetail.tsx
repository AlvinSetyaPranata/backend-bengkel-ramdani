import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Form from '@/components/Molecules/Form'
import { z } from 'zod'

export default function transporatationDetail() {
    const { id } = useLocalSearchParams()

    useEffect(() => console.log(id), [])

    const schema = z.object({
      nama_kendaraan: z.string().min(1, "Harap diisi"),
      warna_kendaraan: z.string().min(1, "Harap diisi"),
      plat_nomor: z.string().min(1, "Harap diisi"),
      gambar_kendaraan: z.string().min(1, "Harap diisi"),
      tahun_produksi: z.string().min(1, "Harap diisi")
    })

    const structure = {
      nama_kendaraan: ["", "Nama Kendaraan"],
      warna_kendaraan: ["", "Warna Kendaraan"],
      plat_nomor: ["", "Plat Nomor"],
      gambar_kendaraan: ["image", "Gambar Kendaraan"],
      tahun_produksi: ["datetime", "Tahun Produksi"]
    }

  return (
    <View style={styles.container}>
     <Form structure={structure} schema={schema} addButtonTitle='Update Transportasi'/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    rowGap: 32
  },

  field: {
    rowGap: 12
  },

  input: {
    backgroundColor: 'white',
    borderRadius: 10,
  }

})