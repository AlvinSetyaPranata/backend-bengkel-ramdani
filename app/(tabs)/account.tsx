import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { SCREEN_HEIGHT } from "@/utils/constans";
import { ThemedText } from "@/components/ThemedText";
import ButtonGroup from "@/components/ButtonGroup";

const IMAGE_TEST = require("@/assets/images/account-test.jpg");

export default function LoginScreen() {
  return (
    <SafeAreaView>
      <ThemedView style={style.container}>
        <View style={style.navbar}>
          <Text style={{ fontWeight: '500'}}>Edit</Text>
        </View>
        <View style={style.header}>
          <Image
            style={style.imageProfile}
            source={IMAGE_TEST}
            alt="account-profile"
          />
          <ThemedText style={style.profileName}>Alvin Setya Pranata</ThemedText>
        </View>

        <ButtonGroup style={style.buttonContainer} />

      </ThemedView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 30,
    boxSizing: "border-box",
    minHeight: SCREEN_HEIGHT,
    alignItems: 'center'
  },

  navbar: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  header: {
    minWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },

  imageProfile: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },

  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24
  },

  buttonContainer: {
    marginTop: 20
  }


});
