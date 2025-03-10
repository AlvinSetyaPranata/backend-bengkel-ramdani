import { ThemedView } from "@/components/ThemedView";
import { SCREEN_HEIGHT } from "@/utils/constans";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  FlatList,
  Pressable,
} from "react-native";

const IMAGE_TEST = require("@/assets/images/account-test.jpg");

const OWNER = "Alvin Setya Pranata";

const DATA = [
  { id: "1", brand: "Nissan GTR", owner: "Alvin Setya Pranata" },
  { id: "2", brand: "Toyota Supra", owner: "Michael Johnson" },
  { id: "3", brand: "Honda Civic Type R", owner: "Emily Davis" },
  { id: "4", brand: "Ford Mustang", owner: "Daniel Martinez" },
  { id: "5", brand: "Chevrolet Camaro", owner: "Sophia Hernandez" },
  { id: "6", brand: "BMW M3", owner: "James Wilson" },
  { id: "7", brand: "Mercedes-Benz AMG", owner: "Olivia Brown" },
  { id: "8", brand: "Audi R8", owner: "Ethan Garcia" },
  { id: "9", brand: "Lamborghini Huracan", owner: "Isabella Rodriguez" },
  { id: "10", brand: "Ferrari 488", owner: "Alexander Thomas" },
  { id: "11", brand: "Porsche 911", owner: "William Lee" },
  { id: "12", brand: "McLaren 720S", owner: "Mia Scott" },
  { id: "13", brand: "Bugatti Chiron", owner: "Benjamin Harris" },
  { id: "14", brand: "Tesla Model S Plaid", owner: "Charlotte White" },
  { id: "15", brand: "Dodge Challenger", owner: "Lucas Adams" },
  { id: "16", brand: "Subaru WRX STI", owner: "Harper Nelson" },
  { id: "17", brand: "Mazda RX-7", owner: "Henry Carter" },
  { id: "18", brand: "Jaguar F-Type", owner: "Ella Mitchell" },
  { id: "19", brand: "Koenigsegg Jesko", owner: "Liam Perez" },
  { id: "20", brand: "Pagani Huayra", owner: "Amelia Gonzalez" },
];

export default function HomeScreen() {
  const handleClick = (id: string) => {
    // Navigate to detail page
  };

  const Item = ({
    id,
    brand,
    owner,
  }: {
    id: string;
    brand: string;
    owner: string;
  }) => (
    <Pressable
      onPress={() => handleClick(id)}
      style={{
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: OWNER == owner ? "black" : "white",
      }}
    >
      <Text style={{ fontSize: 14, color: OWNER == owner ? "white" : "black" }}>
        {brand}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: OWNER == owner ? "white" : "black",
          fontWeight: "500",
        }}
      >
        {owner}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={{ fontWeight: "500", fontSize: 20 }}>Halo Alvin</Text>
          <Image
            style={styles.imageProfile}
            source={IMAGE_TEST}
            alt="account-profile"
          />
        </View>

        <View style={{ marginTop: 50 }}>
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
            Antrian Servis
          </Text>
          <Text style={{ fontSize: 14, marginBottom: 20 }}>
            Anda berada di urutan ke-1
          </Text>
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Item id={item.id} brand={item.brand} owner={item.owner} />
            )}
          />
        </View>        

          <Link href="/addService" style={styles.fab}>
            <View style={styles.fab}>
              <MaterialIcons name="add" size={20} color="white"/>
            </View>
          </Link>


      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 15,
    boxSizing: "border-box",
    minHeight: SCREEN_HEIGHT,
    flex: 1
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageProfile: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },

  fab: {
    position: "absolute",
    right: '10%',
    bottom: '15%',
    backgroundColor: "#0067A5",
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 20
  },
});
