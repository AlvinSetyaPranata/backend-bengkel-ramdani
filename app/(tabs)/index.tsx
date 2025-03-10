import Search from '@/components/Search';
import { ThemedView } from '@/components/ThemedView';
import { SCREEN_HEIGHT } from '@/utils/constans';
import { Image } from 'expo-image';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';


const IMAGE_TEST = require("@/assets/images/account-test.jpg");

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Text style={{fontWeight: '500', fontSize: 20}}>Halo Alvin</Text>
          <Image
            style={styles.imageProfile}
            source={IMAGE_TEST}
            alt="account-profile"
          />
        </View>

        <Search style={{ marginTop: 20}}/>
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
    },

    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    imageProfile: {
      width: 40,
      height: 40,
      borderRadius: 100,
    },
});
