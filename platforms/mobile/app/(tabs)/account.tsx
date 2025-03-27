import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { SCREEN_HEIGHT } from "@/utils/constans";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useStore } from "@tanstack/react-store";
import { profileStore, tokenStore } from "@/store/authStore";

const IMAGE_TEST = require("@/assets/images/account-test.jpg");

export default function LoginScreen() {
  const navigation = useRouter();
  const { token } = useStore(tokenStore);

  const handleLogout = async () => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_API_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Berhasil Logout");
    tokenStore.setState(() => ({ token: "" }));
    navigation.replace("/login");
  };

  const { name, avatar } = useStore(profileStore);

  return (
    <SafeAreaView>
      <ThemedView style={style.container}>
        <View style={style.header}>
          {avatar ? (
            <Image
              style={style.imageProfile}
              source={IMAGE_TEST}
              alt="account-profile"
            />
          ) : (
            <View
              style={{
                backgroundColor: "gray",
                padding: 20,
                borderRadius: 100,
              }}
            >
              <MaterialIcons name="person" size={42} color="white" />
            </View>
          )}
          <ThemedText style={style.profileName}>{name}</ThemedText>
        </View>

        <View style={style.buttonContainer}>
          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.navigate("history")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: "0%",
              }}
            >
              <MaterialIcons name="history" size={20} color="#00000" />
              <Text style={{ marginLeft: 10 }}>Histori Perbaikan</Text>
            </View>
            <MaterialIcons name="arrow-right" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.navigate("transportation")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: "0%",
              }}
            >
              <MaterialIcons name="car-rental" size={20} color="#00000" />
              <Text style={{ marginLeft: 10 }}>Transportasi anda</Text>
            </View>
            <MaterialIcons name="arrow-right" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={style.button}
            onPress={() => navigation.navigate("privacyTerms")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: "0%",
              }}
            >
              <MaterialIcons name="info" size={20} color="#00000" />
              <Text style={{ marginLeft: 10 }}>Kebijakan Privasi</Text>
            </View>
            <MaterialIcons name="arrow-right" size={24} color="#00000" />
          </TouchableOpacity>
          <TouchableOpacity style={style.button} onPress={handleLogout}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
                flexShrink: 1,
                flexBasis: "0%",
              }}
            >
              <MaterialIcons name="logout" size={20} color="#00000" />
              <Text style={{ marginLeft: 10 }}>Keluar Akun</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    paddingTop: 30,
    boxSizing: "border-box",
    minHeight: SCREEN_HEIGHT,
    alignItems: "center",
  },

  header: {
    minWidth: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },

  imageProfile: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },

  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
  },

  buttonContainer: {
    width: "90%",
    height: "90%",
    borderRadius: 10,
    rowGap: 30,
    marginTop: 20,
  },

  button: {
    alignItems: "center",
    flexDirection: "row",
    columnGap: 10,
  },
});
