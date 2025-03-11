import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";



export default function History() {
    const [data, setData] = useState([{}])

    const handleClick = (id: string) => {
        // Navigate to detail page
      };
    
      const Item = ({
        id,
        brand,
        owner,
      }: {
        id: string;
        brand: string;
        owner: string;
      }) => (
        <Pressable
          onPress={() => handleClick(id)}
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "" == owner ? "black" : "white",
          }}
        >
          <Text style={{ fontSize: 14, color: "" == owner ? "white" : "black" }}>
            {brand}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "" == owner ? "white" : "black",
              fontWeight: "500",
            }}
          >
            {owner}
          </Text>
        </Pressable>
      );

  return (
    <View>
      <View style={styles.header}>

      </View>

      <FlatList
                  data={data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Item id={item.id} brand={item.brand} owner={item.owner} />
                  )}
                />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%'
  },
});
