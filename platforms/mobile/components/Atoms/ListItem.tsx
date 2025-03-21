import { Router, useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";

const ListItem = ({
  id,
  title,
  desc,
  span,
  instance,
  href,
}: {
  id: string;
  title: string;
  desc: string;
  span: string;
  instance: unknown,
  href: Router;
}) => {
  const navigation = useNavigation();

  const handleClick = (id: string, name: string, price: string) =>
    navigation.navigate(href, { instance: instance })
  
  return (
      <Pressable
        onPress={() => handleClick(id)}
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 20,
        }}
      >
        <View>
          <Text style={{ fontSize: 17, fontWeight: "500" }}>{title}</Text>
          <Text style={{ fontSize: 12, marginTop: 6 }}>{desc}</Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: "black",
          }}
        >
          {span}
        </Text>
      </Pressable>
    );
};

export default ListItem;
