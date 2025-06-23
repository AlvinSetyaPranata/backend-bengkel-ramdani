import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import WebView from "react-native-webview";


export default function MidtransView() {

    const router = useRouter()
    const { token } : { token: string} = useLocalSearchParams()

    useEffect(() => {
        console.log(`${process.env.EXPO_PUBLIC_MIDTRANS_URL}/${token}`)
        if (!token && router.canGoBack()) {
            router.back()
        }
    }, [])

  return (
    <View style={{flex: 1}}>
      <WebView source={{ uri: `${process.env.EXPO_PUBLIC_MIDTRANS_URL}/${token}`}} style={{ flex: 1}} />
    </View>
  )
}