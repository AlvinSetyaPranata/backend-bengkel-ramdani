import {
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { z } from "zod";
import Field from "../Atoms/Field";
import PasswordField from "../Atoms/PasswordField";
import DatetimeField from "../Atoms/DatetimeField";
import ImageField from "../Atoms/ImageField";

interface propsType {
  structure: Record<string, string>;
  schema: z.ZodObject<{}, "strip", z.AnyZodObject>;
  addButtonTitle?: string;
  defaultValue?: Record<string, string>
}

export default function Form({ structure, schema, addButtonTitle, defaultValue}: propsType) {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});


  // useEffect(() => console.log(errors), [errors])

  const onChange = (name: string, value: string) =>
    setForm((state) => {
      state[name] = value;
      return state;
    });

  const onSubmit = (event: GestureResponderEvent) => {
    console.log(form)

    const result = schema.safeParse(form);

    if (!result.success) {
      // Display error block
      const errors = result.error.format();

      setErrors(
        Object.fromEntries(
          Object.entries(errors)
            .filter(([key]) => key !== "_errors")
            .map(([field, value]) => [field, value._errors.join(", ")])
        )
      );
      
      
      return;
    }

    // Fetch to update resource
  };

  const getField = (key: string, value: string[], index: string, defaultValue?: string) => {

    if (value[0] == "password") {
      return (
        <PasswordField
          key={index}
          title={value[1]}
          name={key}
          type={value[0]}
          setter={onChange}
          error={errors[key] ? errors[key] : null}
          defaultValue={defaultValue[value[2]]}
        />
      )
    } else if (value[0] == "datetime") {
      return (
      <DatetimeField title={value[1]} name={key} setter={onChange} key={index} defaultValue={defaultValue[value[2]]}/>
    )
  } else if (value[0] == "image"){
    return  (
      <ImageField title={value[1]} name={key} key={index} setter={onChange}defaultValue={defaultValue[value[2]]}/>
      )
    }
    
    else {
      return (
        <Field
          key={index}
          title={value[1]}
          name={key}
          type={value[0]}
          setter={onChange}
          error={errors[key] ? errors[key] : null}
          defaultValue={defaultValue[value[2]]}
        />
      );
    }
  };

  return (
    <ScrollView>
      <View style={{ rowGap: 32 }}>
        {Object.entries(structure).map(([key, value], index) =>
          getField(key, value, index, defaultValue)
        )}
      </View>
      <Pressable
        onPress={onSubmit}
        style={{
          backgroundColor: "green",
          marginTop: 32,
          borderRadius: 10,
          paddingVertical: 8,
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {addButtonTitle}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
