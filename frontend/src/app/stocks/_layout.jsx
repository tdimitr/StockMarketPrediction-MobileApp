import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";

export default function StockLayout() {
  return (
    <MenuProvider>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen
          name="[symbol]"
          options={{
            headerTitle: "Stock Details",
            animation: "slide_from_right",
            headerLeft: () => null,
          }}
        />
      </Stack>
    </MenuProvider>
  );
}
