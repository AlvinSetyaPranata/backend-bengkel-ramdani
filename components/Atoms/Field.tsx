import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  name: string;
  setter: (name: string, value: string) => void;
  defaultValue?: string;
  type?: KeyboardTypeOptions|string;
  error?: string;
}

export default function Field({
  title,
  name,
  setter,
  error,
  type,
  defaultValue = "",
}: Props) {
  const [isError, setIsError] = useState(error ? true : false);
  const [value, setValue] = useState(defaultValue);

  const onChangeHandler = (value: string) => {
    setValue(value);
    setter(name, value);
  };

  useEffect(() => setIsError(error ? true : false), [error]);

  const styles = StyleSheet.create({
    input: {
      borderRadius: 10,
      backgroundColor: "white",
      width: "100%",
      marginTop: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: error ? 'red' : 'white'
    },
  
    errorMessege: {
      color: "red",
      fontWeight: 500,
      fontSize: 12,
      marginTop: 10,
      marginLeft: 10,
    },
  });

  return (
    <View>
      <Text>{title}</Text>
      <TextInput
        keyboardType={type}
        style={styles.input}
        onChangeText={onChangeHandler}
        value={value}
      />
      {isError && <Text style={styles.errorMessege}>{error}</Text>}
    </View>
  );
}


