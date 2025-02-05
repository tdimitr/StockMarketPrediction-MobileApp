import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import currencyToCountry from "../../../assets/data/currencyToCountry.json";
import currencies from "../../../assets/data/currencies.json";

export default function Cryptocurrency() {
  const [currency, setCurrency] = useState("usd");
  const [showModal, setShowModal] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  // Function to fetch cryptocurrency prices
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc`
      );
      const data = await response.json();
      if (data) {
        const prices = data.map((coin) => {
          const price = coin.current_price;
          const formattedPrice =
            Math.floor(price).toString().length >= 5
              ? Math.round(price)
              : price.toFixed(2);

          return {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            image: coin.image,
            price: formattedPrice,
            change24h: coin.price_change_percentage_24h.toFixed(2),
          };
        });
        setCryptoPrices(prices);
      }
    } catch (error) {
      console.error("Error fetching cryptocurrency prices:", error);
    } finally {
      setRefreshing(false); // Stop refreshing after data is fetched
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true); // Start refreshing
    fetchCryptoPrices(); // Fetch new data
  };

  // UseEffect hook to initially load cryptocurrency prices
  useEffect(() => {
    fetchCryptoPrices();
  }, [currency]);

  const renderCurrencyItem = (item, setCurrency, closeModal) => (
    <TouchableOpacity
      onPress={() => {
        setCurrency(item.key.toLowerCase());
        closeModal();
      }}
      className="flex-row items-center py-3 px-5 bg-gray-100 rounded-lg mb-3 shadow"
    >
      <CountryFlag
        isoCode={currencyToCountry[item.key]}
        size={25}
        className="mr-4"
      />
      <Text className="text-base font-semibold">{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-100 p-5"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="mb-5">
        <View className="flex-row items-center justify-between p-3 bg-gray-200 rounded-lg mb-3">
          {/* Coin Column */}
          <View className="flex-1">
            <Text className="font-semibold text-gray-800">Coin</Text>
          </View>

          {/* Price Column */}
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            className="w-28 flex-row items-center justify-end pr-4"
          >
            <Text className="font-semibold text-gray-800">Price</Text>
            <FontAwesome5
              name="caret-down"
              size={16}
              className="ml-2 text-gray-500"
            />
          </TouchableOpacity>

          {/* Chg Column */}
          <View className="w-20 items-end">
            <Text className="font-semibold text-gray-800">Chg (24H)</Text>
          </View>
        </View>

        {/* Cryptocurrency Data Rows */}
        {cryptoPrices.length > 0 ? (
          cryptoPrices.map((crypto, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between p-3 bg-white rounded-lg mb-3 shadow"
            >
              <View className="flex-1 flex-row items-center">
                <Image
                  source={{ uri: crypto.image || placeholderImage }}
                  className="w-8 h-8 mr-3"
                  resizeMode="contain"
                />
                <Text
                  className="text-base font-semibold text-gray-800 mr-2"
                  style={{ flexShrink: 1, maxWidth: "50%" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {crypto.symbol}
                </Text>
                <Text
                  className="text-base text-gray-800"
                  style={{ flexShrink: 1, maxWidth: "50%" }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {crypto.name}
                </Text>
              </View>

              <View className="w-28 items-end pr-4">
                <Text className="text-base font-bold text-gray-800">
                  {crypto.price} {currency.toUpperCase()}
                </Text>
              </View>

              <View className="w-20 items-end">
                <Text
                  className={`text-base font-semibold ${
                    crypto.change24h > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {crypto.change24h}%
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-lg text-gray-800">Loading...</Text>
          </View>
        )}
      </View>

      {/* Currency Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View className="flex-1 justify-end items-center bg-black/50">
            <View className="w-full bg-white rounded-t-2xl py-5 px-5 max-h-3/5">
              <FlatList
                data={currencies}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) =>
                  renderCurrencyItem(item, setCurrency, () =>
                    setShowModal(false)
                  )
                }
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}
