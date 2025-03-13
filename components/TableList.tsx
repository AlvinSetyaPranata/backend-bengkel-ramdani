import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useEffect } from "react";
import { LinkProps, useLocalSearchParams, useRouter } from "expo-router";

export type columnsType = { name: string; label: string }[];

interface Props {
  data: { id: string; [key: string]: string }[];
  detailLink: LinkProps["href"];
  columns: columnsType;
  style?: StyleProp<ViewStyle> | {};
  onlyShow?: string[];
}


function generateUriFromData(link: string, columns: columnsType, selectedData: { id: string; [key: string]: string }) {
  let uri = `${link}?`

    columns.map(({name}, index) => {
      console.log("index " + index)

      if (index > 0) {
        uri += `&${encodeURIComponent(name)}=${encodeURIComponent(selectedData[name])}`
      } else {
        uri += `${encodeURIComponent(name)}=${encodeURIComponent(selectedData[name])}`
      }
    })

  return uri

}

export default function TableList({
  data,
  detailLink,
  columns,
  style = {},
  onlyShow=[]
}: Props) {

  const router = useRouter();

  const handeleSelect = (item: { id: string; [key: string]: string }) => {
    const generatedUri =generateUriFromData(detailLink, columns, item)

    router.push(generatedUri)
  }

  return (
    <View style={style}>
      {/* table */}
      <View style={styles.table}>
        <View style={styles.tableHead}>
          {columns.filter(({ name }) => onlyShow.includes(name)).map(({ label }, index: number) => (
            <Text style={styles.tableHeadText} key={index}>
              {label}
            </Text>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 10}}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => handeleSelect(item)}
            >
              {columns.filter(({ name }) => onlyShow.includes(name)).map(({ name }, index: number) => (
                <Text style={styles.tableText} key={index}>
                  {item[name]}
                </Text>
              ))}
            </TouchableOpacity>
          )}
        />
      </View>

      {/* table */}
    </View>
  );
}

const styles = StyleSheet.create({

  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  table: {
    marginTop: 10
  },

  
  tableText: {
    fontSize: 14,
    color: "black",
  },

  tableHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    padding: 10,
  },

  tableHeadText: {
    color: "white",
    fontWeight: "500",
  },
});
