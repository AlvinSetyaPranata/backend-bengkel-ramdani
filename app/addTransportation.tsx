import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import Form from '@/components/Molecules/Form'
import { z } from 'zod'

export default function addTransportation() {
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
      warna_kendaraan: ["password", "Warna Kendaraan"],
      plat_nomor: ["", "Plat Nomor"],
      gambar_kendaraan: ["", "Gambar Kendaraan"],
      tahun_produksi: ["", "Tahun Produksi"]
    }

  return (
    <View style={styles.container}>
     <Form addButtonTitle='Tambah Transportasi' structure={structure} schema={schema} />
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