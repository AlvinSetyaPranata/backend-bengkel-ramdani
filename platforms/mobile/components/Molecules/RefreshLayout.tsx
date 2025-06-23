import { RefreshControl, ScrollView, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'

export default function RefreshLayout({ children } : { children: React.ReactNode}) {

      const [isRefreshing, setIsRefreshing] = useState(false)

    const refreshHandler = useCallback(() => {
        setIsRefreshing(true)
    
        setTimeout(() => {
          setIsRefreshing(false)
        }, 1000);
      }, [])
    


  return (
    <ScrollView refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshHandler} />}>
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({})