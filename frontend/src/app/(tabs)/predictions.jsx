import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

export default function Predictions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const router = useRouter();

  const algorithms = [
    {
      name: "Linear Regression",
      key: "linear",
      details:
        "Linear Regression is a simple algorithm that predicts continuous values based on the linear relationship between input variables.",
    },
    {
      name: "Support Vector Machines",
      key: "svm",
      details:
        "Support Vector Machines are supervised learning models that analyze data for classification and regression analysis.",
    },
    {
      name: "Random Forests",
      key: "random",
      details:
        "Random Forests are ensemble learning methods that use multiple decision trees to improve prediction accuracy.",
    },
  ];

  const navigateToAlgorithm = (key) => {
    router.push(`/algorithms/${key}`);
  };

  const showDetails = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-100 p-5">
      {/* Algorithms Header */}
      <Text className="text-2xl font-bold mb-5">Algorithms</Text>

      {algorithms.map((algo, index) => (
        <View
          key={index}
          className="mb-5"
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          {/* Algorithm Box: Navigates to Dynamic Page */}
          <TouchableOpacity
            onPress={() => navigateToAlgorithm(algo.key)}
            style={{ flex: 1 }}
          >
            <View className="bg-white p-4 rounded-lg shadow-md">
              <Text className="text-lg font-semibold">{algo.name}</Text>
            </View>
          </TouchableOpacity>

          {/* Question Mark Icon: Opens Modal */}
          <TouchableOpacity
            onPress={() => showDetails(algo)}
            style={{ marginLeft: 10 }}
          >
            <AntDesign name="questioncircle" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      ))}

      {/* Algorithm Details Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-lg p-5">
            <Text className="text-xl font-bold mb-3 text-center">
              {selectedAlgorithm.name}
            </Text>
            <Text className="text-base text-gray-700 mb-5 text-center">
              {selectedAlgorithm.details}
            </Text>
            <View className="flex-row justify-center mt-5">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="closecircle" size={26} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
