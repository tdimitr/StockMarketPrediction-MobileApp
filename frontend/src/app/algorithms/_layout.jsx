import { Stack } from "expo-router";

export default function StockLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="[algorithm]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
