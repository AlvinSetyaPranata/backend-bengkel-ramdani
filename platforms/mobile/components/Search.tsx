import { Pressable, StyleSheet, Text, TextInput, View, ViewProps } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

export default function Search({ style } : { style?: ViewProps}) {
    const [value, setValue] = useState("")
    const [show, setShow] = useState(false)

    const handleClick = () => {
        if (value) {
            setValue("")
        } else {
            // Do search
        }
    }

    useEffect(() => {
        if (value) {
            setShow(true)
        }
        else {
            setShow(false)
        }
    }, [value])


  return (
    <View style={style}>
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder='Cari Layanan' onChangeText={setValue} value={value}/>
            <Pressable onPress={handleClick}>
                { show ? 
                (
                    <MaterialIcons name='clear' size={18}/>
                )
                :
                (
                    <MaterialIcons name='search' size={18}/>
                )
            }
            </Pressable>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '50%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingRight: 10,
    },

    input: {
        fontSize: 13,
        flexShrink: 1,
        flexGrow: 1,
        flexBasis: '0%',
        width: '100%',
        paddingLeft: 5
    }
})