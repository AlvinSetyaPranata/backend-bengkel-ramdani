import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'


interface Props {
  title: string,
  name: string,
  setter: (name: string, value: string) => void,
  defaultValue?: string,
  type?: KeyboardTypeOption|string,
  error?: string
}


export default function PasswordField({ title, name, setter, error, type, defaultValue="" }: Props) {

  const [isError, setIsError] = useState(error ? true : false)
  const [value, setValue] = useState(defaultValue)
  const [visible, setVisible] = useState(true)

  const onChangeHandler = (value: string) => {
    setValue(value)
    setter(name, value)
  }

  useEffect(() => setIsError(error ? true : false), [error])

  const styles = StyleSheet.create({

    inputContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      marginTop: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: error ? 'red' : 'white'
    },
  
    input: {
      flexBasis: '0%',
      flexGrow: 1,
      flexShrink: 1,
    },
  
    errorMessege: {
      color: 'red',
      fontWeight: 500,
      fontSize: 12,
      marginTop: 10,
      marginLeft: 10
    }
  })

  return (
    <View>
      <Text>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput keyboardType={type} style={styles.input} onChangeText={onChangeHandler} value={value} secureTextEntry={visible}/>
        <Pressable onPress={() => setVisible(state => !state)}>
          <MaterialIcons name={visible ? "visibility" : "visibility-off"} color="black" size={16} />
        </Pressable>
      </View>
        {isError && 
          <Text style={styles.errorMessege}>{error}</Text>
        }
    </View>
  )
}

