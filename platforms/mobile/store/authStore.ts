import { Store } from "@tanstack/react-store";
import AsyncStorage from "@react-native-async-storage/async-storage";




const loadState = async () => {
  const savedState = await AsyncStorage.getItem("store");
  return savedState ? JSON.parse(savedState) : { token: "" };
};

export const tokenStore = new Store({
    token: '',
});

(async () => {
    const initialState = await loadState();
    tokenStore.setState(initialState);
  })();

tokenStore.subscribe(async (state) => {
  await AsyncStorage.setItem("store", JSON.stringify(state));
});
