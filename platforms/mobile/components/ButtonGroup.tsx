import { StyleSheet, Text, TouchableOpacity, View, ViewProps } from 'react-native'
import React, { PropsWithChildren } from 'react'
import { MaterialIcons } from '@expo/vector-icons'

export default function ButtonGroup({ style, children }: {style?: ViewProps} & PropsWithChildren) {
    const styles = StyleSheet.create({
        container: {
            width: '90%',
            height: '90%',
            borderRadius: 10,
            rowGap: 30,
            ...style
        },
    })

  return (
    <View style={styles.container}>
      {children}
    </View>
  )
}

