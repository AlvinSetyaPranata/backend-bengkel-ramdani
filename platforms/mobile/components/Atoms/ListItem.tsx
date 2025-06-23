import { MaterialIcons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const ListItem = ({
  id,
  title,
  desc,
  instance,
  href,
}: {
  id: string;
  title: string;
  desc: string;
  instance: unknown,
  href: Href | any;
}) => {
  const navigation = useRouter();

  const handleClick = () =>{
    navigation.navigate({ pathname: href, params: { instance: JSON.stringify(instance) }})}
  
  return (
      <Pressable
        onPress={handleClick}
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
        <MaterialIcons name="chevron-right" size={18}/>
      </Pressable>
    );
};

export default ListItem;
