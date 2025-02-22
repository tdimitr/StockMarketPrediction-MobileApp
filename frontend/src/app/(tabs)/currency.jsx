import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import currencyToCountry from "../../../assets/data/currencyToCountry.json";
import currencies from "../../../assets/data/currencies.json";
import Constants from "expo-constants";

// Function to fetch exchange rate
const fetchExchangeRate = async (from, to) => {
  const EXCHANGERATE_API_KEY = Constants.expoConfig.extra.EXCHANGERATE_API_KEY;
  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/pair/${from}/${to}`
    );
    const data = await response.json();

    if (data.result === "success") {
      return data.conversion_rate; // Returns the conversion rate
    } else {
      console.error("Error fetching exchange rate:", data.error);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default function CurrencyConverter() {
  const [currencyFrom, setCurrencyFrom] = useState("EUR");
  const [currencyTo, setCurrencyTo] = useState("USD");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(null);
  const [showModalFrom, setShowModalFrom] = useState(false);
  const [showModalTo, setShowModalTo] = useState(false);

  // Fetch conversion rate whenever currencyFrom or currencyTo changes
  const getConversionRate = async () => {
    const rate = await fetchExchangeRate(currencyFrom, currencyTo);
    if (rate) {
      setConversionRate(rate);
    }
  };

  // Recalculate converted amount whenever the amount or rate changes
  const calculateConvertedAmount = () => {
    if (amount && conversionRate) {
      setConvertedAmount((parseFloat(amount) * conversionRate).toFixed(2));
    } else {
      setConvertedAmount("");
    }
  };

  useEffect(() => {
    getConversionRate();
  }, [currencyFrom, currencyTo]);

  useEffect(() => {
    calculateConvertedAmount();
  }, [amount, conversionRate]);

  const renderCurrencyItem = (item, setCurrency, closeModal) => (
    <TouchableOpacity
      onPress={() => {
        setCurrency(item.key);
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
    <View className="flex-1 bg-gray-100 p-5">
      {/* Input Currency Box */}
      <View className="mb-5">
        <View className="flex-row justify-between bg-white p-4 rounded-xl shadow mb-3">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-800">From</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              className="mt-2 text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 w-full"
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowModalFrom(true)}
            className="flex-row items-center"
          >
            <CountryFlag
              isoCode={currencyToCountry[currencyFrom]}
              size={24}
              className="mr-2"
            />
            <Text className="text-lg font-bold text-gray-800">
              {currencyFrom}
            </Text>
            <FontAwesome5
              name="caret-down"
              size={18}
              className="ml-2 text-gray-500"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-right text-sm text-gray-600">
          {conversionRate
            ? `1 ${currencyFrom} = ${conversionRate} ${currencyTo}`
            : "Loading..."}
        </Text>
      </View>

      {/* Output Currency Box */}
      <View className="mb-5">
        <View className="flex-row justify-between bg-white p-4 rounded-xl shadow mb-3">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-800">To</Text>
            <TextInput
              value={convertedAmount}
              className="mt-2 text-xl font-bold text-gray-800 border-b border-gray-300 pb-1 w-full"
              placeholder="Converted amount"
              editable={false}
            />
          </View>
          <TouchableOpacity
            onPress={() => setShowModalTo(true)}
            className="flex-row items-center"
          >
            <CountryFlag
              isoCode={currencyToCountry[currencyTo]}
              size={24}
              className="mr-2"
            />
            <Text className="text-lg font-bold text-gray-800">
              {currencyTo}
            </Text>
            <FontAwesome5
              name="caret-down"
              size={18}
              className="ml-2 text-gray-500"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-right text-sm text-gray-600">
          {conversionRate
            ? `1 ${currencyTo} = ${(1 / conversionRate).toFixed(
                4
              )} ${currencyFrom}`
            : "Loading..."}
        </Text>
      </View>

      {/* Modals for Currency Selector */}
      <Modal
        visible={showModalFrom}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModalFrom(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-2xl pt-5 px-5 shadow h-1/2">
              <Text className="text-xl font-bold mb-4">Select Currency</Text>
              <FlatList
                data={currencies}
                renderItem={({ item }) =>
                  renderCurrencyItem(item, setCurrencyFrom, () =>
                    setShowModalFrom(false)
                  )
                }
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={showModalTo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModalTo(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-2xl pt-5 px-5 shadow h-1/2">
              <Text className="text-xl font-bold mb-4">Select Currency</Text>
              <FlatList
                data={currencies}
                renderItem={({ item }) =>
                  renderCurrencyItem(item, setCurrencyTo, () =>
                    setShowModalTo(false)
                  )
                }
                keyExtractor={(item) => item.key}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
