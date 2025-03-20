import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  Pressable,
} from "react-native";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useStore } from "@tanstack/react-store";
import { tokenStore } from "@/store/authStore";

export default function login() {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email tidak valid"),

    password: Yup.string().required("Password tidak valid"),
  });

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.heading}>login</Text>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors }) => {
            const data = new FormData();

            Object.entries(values).map(([key, value]) =>
              data.append(key, value)
            );

            const response = await fetch(
              `${process.env.EXPO_PUBLIC_BASE_API_URL}/login`,
              {
                method: "POST",
                body: data,
              }
            );
            const resData = await response.json();

            if (!response.ok) {
              alert(resData.pesan)
              return
            }


            alert("Sukses");
            tokenStore.setState(() => ({ token: resData.data.token }));

            setTimeout(() => {
              router.push("/");
            }, 2000);
            return;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{ padding: 30 }}>
              {/* Email Field */}
              <Text style={{ marginBottom: 10 }}>Email:</Text>
              <TextInput
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
              {touched.email && errors.email && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginLeft: 5,
                    marginTop: 10,
                  }}
                >
                  {errors.email}
                </Text>
              )}

              {/* Password Field */}
              <Text style={{ marginTop: 30, marginBottom: 10 }}>Password:</Text>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingRight: 5,
                  borderRadius: 10,
                }}
              >
                <TextInput
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  style={styles.input}
                />
                <MaterialIcons name="visibility" />
              </View>
              {touched.password && errors.password && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginLeft: 5,
                    marginTop: 10,
                  }}
                >
                  {errors.password}
                </Text>
              )}

              {/* Submit Button */}
              <Pressable
                style={{
                  backgroundColor: "black",
                  borderRadius: 10,
                  paddingVertical: 10,
                  marginTop: 30,
                }}
                onPress={() => handleSubmit()}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Masuk
                </Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    // backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: 24,
    fontWeight: "500",
  },

  input: {
    minWidth: 250,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
