import {
    SafeAreaView,
    StyleSheet,
    View,
    TextInput,
    Button,
    Text,
    Pressable,
  } from "react-native";
  import React, { useState } from "react";
  import { Formik } from "formik";
  import * as Yup from "yup";
  import { MaterialIcons } from "@expo/vector-icons";
  import { Link, useRouter } from "expo-router";
  import Toast from "react-native-toast-message";
  import { useStore } from "@tanstack/react-store";
  import { tokenStore } from "@/store/authStore";
  
  export default function register() {
    const router = useRouter();
    const [visiblePassword, setVisiblePassword] = useState(false)
  
    const validationSchema = Yup.object().shape({
      name: Yup.string().required("Nama tidak valid"),
      email: Yup.string().email("Invalid email").required("Email tidak valid"),
      password: Yup.string().required("Password tidak valid"),
    });
  
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.heading}>Daftar</Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setErrors }) => {
              
              const response = await fetch(
                `${process.env.EXPO_PUBLIC_BASE_API_URL}/register`,
                {
                  headers: {
                    'Content-Type' : "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify(values),
                }
              );
              const resData = await response.json();
  
              if (!response.ok) {
                alert(resData.pesan)

                const fieldsError: Record<string, string> = {}

                Object.entries(resData.errors).map(([key, value]) => {
                  fieldsError[key] = value[0]
                })
  
                setErrors(fieldsError)

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
                {/* Name Field */}
                <Text style={{ marginBottom: 10, color: (touched.name && errors.name) ? "red" : "black"}}>Nama:</Text>
                <TextInput
                  value={values. name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  placeholder="Enter your name"
                  keyboardType="default"
                  autoCapitalize="none"
                  style={styles.input}
                />
                {touched.name && errors.name && (
                  <Text
                    style={{
                      color: "red",
                      fontSize: 12,
                      marginLeft: 5,
                      marginTop: 10,
                    }}
                  >
                    {errors.name}
                  </Text>
                )}
                {/* Email Field */}
                <Text style={{ marginBottom: 10, marginTop: 30, color: (touched.email && errors.email) ? "red" : "black" }}>Email:</Text>
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
                    paddingRight: 10,
                    borderRadius: 10,
                  }}
                >
                  <TextInput
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Enter your password"
                    secureTextEntry={visiblePassword ? false : true}
                    style={styles.input}
                  />
                  <Pressable onPress={() => setVisiblePassword(state => !state)}>
                    <MaterialIcons name={visiblePassword ? 'visibility-off' : 'visibility'} size={16} />
                  </Pressable>
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
                    marginTop: 40,
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
                    Daftar
                  </Text>
                </Pressable>
                <Link
                  href="/login"
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    paddingVertical: 10,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "black",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Masuk
                  </Text>
                </Link>
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
  