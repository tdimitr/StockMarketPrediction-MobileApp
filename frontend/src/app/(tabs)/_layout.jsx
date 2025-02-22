import { Tabs } from "expo-router";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      {/* Markets Tab */}
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Markets",
          tabBarLabel: "Markets",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "show-chart" : "show-chart"}
              size={27}
              color={color}
            />
          ),
        }}
      />

      {/* Predictions Tab */}
      <Tabs.Screen
        name="predictions"
        options={{
          headerTitle: "Predictions",
          tabBarLabel: "Predictions",
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "bar-chart" : "bar-chart"}
              size={30}
              color={color}
            />
          ),
        }}
      />

      {/* Currency Converter Tab */}
      <Tabs.Screen
        name="currency"
        options={{
          headerTitle: "Converter",
          tabBarLabel: "Converter",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? "calculator" : "calculator"}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* Cryptocurrency Tab */}
      <Tabs.Screen
        name="cryptocurrency"
        options={{
          headerTitle: "Cryptocurrency",
          tabBarLabel: "Cryptocurrency",
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name={focused ? "bitcoin" : "bitcoin"}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
