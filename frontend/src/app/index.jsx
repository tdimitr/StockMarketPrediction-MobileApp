import { useEffect, useState } from "react";
import { View, Image, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={{
            uri: "https://www.uth.gr/sites/default/files/contents/logos/UTH-logo-english.png",
          }}
          className="w-24 h-24 mb-5"
        />
        <Text className="font-bold mb-5 text-center">
          UTH - An Application for Stock Price Prediction Using Machine Learning
          Methods
        </Text>

        <ActivityIndicator size="large" color="#ff0000" className="mt-5" />

        <Text className="text-gray-500 text-xs mt-5">
          Built by Tsapalas Dimitrios-Nikolaos © 2025
        </Text>
      </View>
    );
  }

  return <Redirect href="/(tabs)" />;
}
