import { Stack } from "expo-router";

export default function StockLayout() {
  return (
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
  );
}
