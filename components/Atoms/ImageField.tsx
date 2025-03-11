import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface Props {
  title: string;
  name: string;
  setter: (name: string, value: string) => void;
  defaultValue?: string;
}

export default function ImageField({
  title,
  name,
  setter,
  defaultValue = "",
}: Props) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Fix media type
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Selected Image URI:", result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => setter(name, image), [image])

  return (
    <View>
      <Text>{title}</Text>

      {!image ? (
        <Pressable onPress={pickImage} style={styles.imageContainer}>
          <MaterialIcons name="photo-library" color="black" size={24} />
        </Pressable>
      ) : (
        <Pressable onPress={pickImage}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            />
          </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 12,
  },
  image: {
    width: 150, // ✅ Set fixed width
    height: 150, // ✅ Set fixed height
    borderRadius: 10,
    marginTop: 12,
  },
});
