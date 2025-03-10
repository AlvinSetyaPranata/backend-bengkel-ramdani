import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

export default function ButtonGroup({ style }: {style?: ViewProps}) {
    const styles = StyleSheet.create({
        container: {
            width: '90%',
            height: '90%',
            borderRadius: 10,
            rowGap: 30,
            ...style
        },
        
        buttonContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            columnGap: 10,
        }
    })

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', flexGrow: 1, flexShrink: 1, flexBasis: '0%'}}>
          <MaterialIcons name='history' size={24} color="#00000"  />
          <Text style={{ marginLeft: 10 }}>Histori Perbaikan</Text>
        </View>
        <MaterialIcons name='arrow-right' size={24} color="#00000"  />
      </TouchableOpacity>
    </View>
  )
}

