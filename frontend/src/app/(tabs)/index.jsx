import { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Market() {
  const [searchText, setSearchText] = useState("");
  const [popularStocks, setPopularStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchStocksData = async () => {
    try {
      const response = await fetch(
        "https://flaskserver-6avz.onrender.com/api/popular-stocks"
      );
      const data = await response.json();
      setPopularStocks(data);
    } catch (error) {
      console.error("Error fetching stocks:", error.message);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchStocksData();
      setLoading(false);
    };
    loadInitialData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStocksData();
    setRefreshing(false);
  };

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
          <Text className="text-lg text-gray-900">
            ${item.currentPrice.toFixed(2)}
          </Text>
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#000000"]}
              tintColor="#000000"
              progressBackgroundColor="#ffffff"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
