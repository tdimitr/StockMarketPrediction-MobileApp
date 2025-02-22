import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function AlgorithmDetails() {
  const { algorithm } = useLocalSearchParams(); // Either 'linear', 'svm', or 'random'
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [popularStocks, setPopularStocks] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state for stocks
  const [isImageLoading, setIsImageLoading] = useState(false); // Add loading state for prediction images
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal state

  const algorithmNames = {
    linear: "Linear Regression",
    svm: "Support Vector Machines",
    random: "Random Forests",
  };

  useEffect(() => {
    const fetchPopularStocks = async () => {
      try {
        const response = await fetch(
          "https://flaskserver-6avz.onrender.com/api/popular-stocks"
        );
        const data = await response.json();
        setPopularStocks(data);
      } catch (error) {
        console.error("Error fetching popular stocks:", error);
      } finally {
        setIsLoading(false); // Stop loading once data is fetched
      }
    };

    fetchPopularStocks();
  }, []);

  const handleSearchSubmit = async () => {
    if (search.trim()) {
      const apiUrl = `https://flaskserver-6avz.onrender.com/api/${algorithm}/${search}`;
      setIsImageLoading(true); // Start loading images
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setPrediction(data);
      } catch (error) {
        console.error("Error fetching prediction data:", error);
      } finally {
        setIsImageLoading(false); // Stop loading images once data is fetched
      }
    }
  };

  const renderStockIcon = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSearch(item.symbol)}
      style={{
        alignItems: "center",
        margin: 10,
        width: 40,
        height: 80,
      }}
    >
      <Image
        source={{ uri: item.logoUrl }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#e0e0e0",
        }}
      />
      <Text
        style={{
          fontSize: 12,
          marginTop: 5,
          textAlign: "center",
          color: "#374151",
        }}
      >
        {item.symbol}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-6 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-2 mt-4"
        >
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800 mt-4">
          {algorithmNames[algorithm] || "Algorithm"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          marginVertical: 20,
        }}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Enter stock symbol..."
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 10,
          }}
        />
        <TouchableOpacity
          onPress={handleSearchSubmit}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="search" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text className="mt-4 text-lg text-gray-500">Loading...</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 10 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text className="text-lg font-semibold mb-4 text-gray-700">
            Popular Stocks
          </Text>
          <FlatList
            data={popularStocks}
            keyExtractor={(item) => item.symbol}
            renderItem={renderStockIcon}
            numColumns={5}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            scrollEnabled={false} // Prevent FlatList scrolling inside ScrollView
          />

          {isImageLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Text className="mt-4 text-lg text-gray-500">Loading...</Text>
            </View>
          ) : (
            prediction && (
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Image
                  source={{ uri: prediction.plot_url1 }}
                  style={{
                    width: "120%",
                    height: 200,
                    resizeMode: "contain",
                    marginBottom: 10,
                  }}
                />
                <Image
                  source={{ uri: prediction.plot_url2 }}
                  style={{
                    width: "120%",
                    height: 200,
                    resizeMode: "contain",
                  }}
                />
              </View>
            )
          )}
        </ScrollView>
      )}

      {/* Info Icon */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#f0f0f0",
          borderRadius: 20,
          padding: 10,
          elevation: 3,
        }}
      >
        <AntDesign name="questioncircle" size={24} color="#3B82F6" />
      </TouchableOpacity>

      {/* Modal for displaying information */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              elevation: 5,
            }}
          >
            <ScrollView>
              <Text style={{ fontSize: 16, color: "#333", marginBottom: 10 }}>
                {"\u2022"} MAE: MAE shows the average deviation of the
                predictions from the actual values. For example, if the MAE is
                1.2, it means that, on average, the algorithm's prediction is
                1.2 units away from the actual value. The smaller the MAE, the
                more accurate the predictions are.
                {"\n\n\u2022"} MSE: MSE measures the mean squared deviation
                between predictions and actual values. MSE "penalizes" large
                deviations more because they often indicate a serious problem
                with the algorithm's predictions. If the algorithm makes a large
                mistake, MSE will increase significantly, helping us identify
                when the algorithm is not performing well.
                {"\n\n\u2022"} RMSE: RMSE is the square root of MSE. If RMSE is
                1.5, it means that on average, the errors in the predictions are
                about 1.5 units. The smaller the RMSE, the better the
                predictions.
                {"\n\n\u2022"} R²: Shows how well the model explains the
                variance of the data. R² ranges from 0 to 1. For example, if R²
                = 0.85, it means that the model explains 85% of the variance in
                the data. If R² = 1, the model predicts perfectly, while if R²
                is near 0, it means the model is not good at prediction.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
