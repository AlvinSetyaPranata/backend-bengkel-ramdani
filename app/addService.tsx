import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";

export default function addService() {
  const [selectedValue, setSelectedValue] = useState("javascript");

  return (
    <View style={styles.container}>
      <View style={styles.field}>
      <Text>Transportasi</Text>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
          style={{ height: 50,width: '100%', backgroundColor: "white" }}
        >
          <Picker.Item enabled={true} label="Java" value="java" />
          <Picker.Item label="JavaScript" value="javascript" />
          <Picker.Item label="Python" value="python" />
        </Picker>
      </View>
      <View style={styles.field}>
        <Text>Keluhan</Text>
        <TextInput multiline={true} style={styles.input} />
      </View>
      <Pressable style={styles.button}>
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "600" }}
        >
          Ajukan
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    rowGap: 32,
  },

  field: {
    rowGap: 10,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14
  },

  button: {
    backgroundColor: "#0067A5",
    borderRadius: 10,
    textAlign: "center",
    paddingVertical: 10,
  },
});
