import { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { LineChart, CandlestickChart } from "react-native-wagmi-charts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

export default function StockDetail() {
  const { symbol } = useLocalSearchParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    async function fetchStockData() {
      try {
        const response = await fetch(
          `https://flaskserver-6avz.onrender.com/api/stock/${symbol}`
        );
        const data = await response.json();
        setStockData(data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStockData();
  }, [symbol]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-lg text-gray-800">Loading...</Text>
      </View>
    );
  }

  const getChartIcon = () => {
    return chartType === "line" ? (
      <AntDesign name="linechart" size={24} color="black" />
    ) : (
      <MaterialIcons name="candlestick-chart" size={24} color="black" />
    );
  };

  const chartData =
    stockData?.historicalData?.map((item, index) => ({
      timestamp:
        new Date().getTime() -
        (stockData.historicalData.length - index) * 1000 * 60 * 60 * 24,
      value: item.Close,
    })) || [];

  const candlestickData =
    stockData?.historicalData?.map((item, index) => ({
      timestamp:
        new Date().getTime() -
        (stockData.historicalData.length - index) * 1000 * 60 * 60 * 24,
      open: item.Open,
      high: item.High,
      low: item.Low,
      close: item.Close,
    })) || [];

  const priceChange = stockData?.currentPrice - stockData?.previousClose;
  const priceChangePercent = (
    (priceChange / stockData?.previousClose) *
    100
  ).toFixed(2);
  const priceChangeColor = priceChange < 0 ? "text-red-500" : "text-green-500";

  const formattedDate = new Date().toLocaleDateString();
  const averageOpen =
    stockData?.historicalData?.reduce((acc, item) => acc + item.Open, 0) /
    stockData?.historicalData?.length;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View className="mt-4">
        {/* Stock Name and Symbol */}
        <Text className="text-xl font-bold text-gray-800">
          {stockData?.longName} ({stockData?.symbol})
        </Text>

        {/* Sector & Industry Pills */}
        <View className="mt-4 flex-row">
          {/* Sector */}
          <View className="px-4 py-2 border border-gray-300 rounded-full mr-3">
            <Text className="text-black text-lg font-semibold">
              {stockData?.sector}
            </Text>
          </View>

          {/* Industry */}
          <View className="px-4 py-2 border border-gray-300 rounded-full">
            <Text className="text-black text-lg font-semibold">
              {stockData?.industry}
            </Text>
          </View>
        </View>
      </View>

      {/* Current Price, Change, and Date */}
      <View className="mt-2">
        <Text className="text-2xl font-semibold text-gray-900">
          ${stockData?.currentPrice.toFixed(2)}
        </Text>
        <Text className={`text-lg ${priceChangeColor}`}>
          {priceChange < 0 ? "-" : "+"}${Math.abs(priceChange).toFixed(2)} (
          {priceChangePercent}%)
        </Text>
        <Text className="text-sm text-gray-500">{formattedDate}</Text>
      </View>

      {/* Chart Type Selection */}
      <View className="mt-4 flex-row justify-end">
        <Menu>
          <MenuTrigger>
            <View className="flex-row items-center px-3 py-2 bg-white rounded-lg shadow">
              {getChartIcon()}
              <Text className="ml-2 text-lg text-gray-800">
                {chartType === "line" ? "Line" : "Candle"}
              </Text>
              <AntDesign name="down" size={16} color="black" className="ml-2" />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => setChartType("line")}>
              <View className="flex-row items-center p-2">
                <AntDesign name="linechart" size={20} color="black" />
                <Text className="ml-2 text-lg">Line</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={() => setChartType("candlestick")}>
              <View className="flex-row items-center p-2">
                <MaterialIcons
                  name="candlestick-chart"
                  size={20}
                  color="black"
                />
                <Text className="ml-2 text-lg">Candle</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      {/* Chart Rendering */}
      {chartType === "candlestick" ? (
        <CandlestickChart.Provider data={candlestickData}>
          <CandlestickChart>
            <CandlestickChart.Candles />
          </CandlestickChart>
        </CandlestickChart.Provider>
      ) : (
        <LineChart.Provider data={chartData}>
          <LineChart>
            <LineChart.Path color="red">
              <LineChart.Gradient />
              <LineChart.HorizontalLine
                at={{ value: stockData?.currentPrice }}
              />
            </LineChart.Path>
          </LineChart>
        </LineChart.Provider>
      )}

      <View className="mt-4">
        <Text className="text-lg font-semibold text-gray-800">
          Key Statistics
        </Text>

        <View className="mt-2">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">Previous Close:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              ${stockData?.previousClose}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">Open:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              ${averageOpen?.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">Day's Range:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              ${stockData?.dayHigh} - ${stockData?.dayLow}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">52 Week Range:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              ${stockData?.fiftyTwoWeekLow} - ${stockData?.fiftyTwoWeekHigh}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">Volume:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              {stockData?.volume}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">Market Cap:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              {stockData?.marketCap}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">
              Beta (5Y Monthly):
            </Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              {stockData?.beta}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">PE Ratio (TTM):</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              {stockData?.trailingPE}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">
              Forward Dividend & Yield:
            </Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              {stockData?.dividendRate} ({stockData?.dividendYield}%)
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">
              Ex-Dividend Date:
            </Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              {stockData?.exDividendDate}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-700 w-1/2">1y Target Est:</Text>
            <Text className="text-sm text-gray-700 text-right w-1/2">
              ${stockData?.targetMeanPrice}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
