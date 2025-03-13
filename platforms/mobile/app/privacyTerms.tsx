import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import Detail from '@/components/Molecules/Detail'

export default function privacyTerms() {
  return (
   <Detail title='Kebijakan dan Privasi'>
         <WebView source={{ uri: "https://www.privacypolicies.com/live/2607379c-fc01-4085-ada2-5373eaf99fe8" }} />
   </Detail>
  )
}

const styles = StyleSheet.create({})