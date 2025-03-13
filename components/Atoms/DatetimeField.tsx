import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface Props {
  title: string;
  name: string;
  setter: (name: string, value: string) => void;
  defaultValue?: string;
}

export default function DatetimeField({
  title,
  name,
  setter,
  defaultValue = null,
}: Props) {
  const [value, setValue] = useState(new Date(defaultValue));
  const [show, setShow] = useState(false);

  const onChangeHandler = (event: DateTimePickerEvent, selectedDate?: Date) => {
    event.nativeEvent;

    if (event.type == "dismissed" || event.type == "set") {
      if (selectedDate) {
        setValue(selectedDate);
      }

      setShow(false);
      return;
    }
  };


  useEffect(() => setter(name, value), [value])

  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 10,
      marginTop: 12,
      paddingHorizontal: 10,
    },

    input: {
      flexBasis: "0%",
      flexGrow: 1,
      flexShrink: 1,
    },

    errorMessege: {
      color: "red",
      fontWeight: 500,
      fontSize: 12,
      marginTop: 10,
      marginLeft: 10,
    },
  });

  // useEffect(() => console.log(value), [value]);

  return (
    <View>
      <Text>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          readOnly={true}
          value={value.getFullYear().toString()}
          style={styles.input}
        />
        <Pressable onPress={() => setShow(true)}>
          <MaterialIcons name="date-range" color="black" size={16} />
        </Pressable>
      </View>
      {show && <RNDateTimePicker value={value} onChange={onChangeHandler} />}
    </View>
  );
}
