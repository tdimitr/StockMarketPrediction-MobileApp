import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Market() {
  const [searchText, setSearchText] = useState("");
  const [popularStocks, setPopularStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://192.168.1.6:5000/api/popular-stocks"
        );
        const data = await response.json();
        setPopularStocks(data);
      } catch (error) {
        console.error("Error fetching stocks:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      router.push(`/stocks/${searchText.trim()}`);
    }
  };

  const renderStockItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(`/stocks/${item.symbol}`)}>
      <View className="flex-row justify-between items-center bg-white p-4 rounded-md shadow-md mb-3">
        <View className="flex-row items-center flex-1">
          {item.logoUrl && (
            <Image
              source={{ uri: item.logoUrl }}
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <View>
            <Text className="font-bold text-lg text-gray-900">
              {item.symbol}
            </Text>
            <Text className="text-gray-700">{item.longName}</Text>
          </View>
        </View>
        <View className="items-end ml-4">
          <Text className="text-lg text-gray-900">{item.currentPrice}</Text>
          <Text
            className={`font-bold ${
              item.changePercent.startsWith("-")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {item.changePercent}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          marginVertical: 20,
        }}
      >
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search stocks..."
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
          }}
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity
          onPress={handleSearchSubmit}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="search" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Popular Stocks Section */}
      <Text className="text-2xl font-bold text-gray-800 mb-4 px-4">
        Popular Stocks
      </Text>

      {loading ? (
        <View className="flex-1 items-center justify-center bg-gray-100">
          <Text className="text-lg text-gray-800">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={popularStocks}
          keyExtractor={(item) => item.symbol}
          renderItem={renderStockItem}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        />
      )}
    </SafeAreaView>
  );
}
