import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { roomService } from "./services/roomService";
import { useLocalSearchParams } from "expo-router";

interface QuestionFormProps {
  roomId: number; // Add prop for room ID
}

export default function TeacherQuestionPage() {
  const { roomId } = useLocalSearchParams();
  const parsedRoomId = Number(roomId);
  const [question, setQuestion] = useState("");
  const [variants, setVariants] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  if (roomId === undefined) {
    console.error("roomId is undefined");
  }

  const handleVariantChange = (index: number, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = value;
    setVariants(newVariants);
  };

  const validateForm = (): boolean => {
    if (!question.trim()) {
      Alert.alert("Validation Error", "Please enter a question");
      return false;
    }

    const filledVariants = variants.filter((variant) => variant.trim() !== "");
    if (filledVariants.length < 2) {
      Alert.alert(
        "Validation Error",
        "Please provide at least two answer variants"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!parsedRoomId) {
      Alert.alert("Error", "Invalid Room ID");
      return;
    }
  
    if (!validateForm()) return;
  
    try {
      const payload = {
        questionText: question.trim(),
        options: variants.filter((variant) => variant.trim() !== ""),
        correctAnswer: variants[correctAnswer].trim(),
      };
  
      const response = await roomService.addQuestion(parsedRoomId, payload);
      const data = response?.data as { success?: boolean };
      
      if (data?.success) {
        setQuestion("");
        setVariants(["", "", "", ""]);
        setCorrectAnswer(0);
  
        Alert.alert("Success", "Question submitted successfully");
      } else {
        throw new Error("Question submission failed");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      Alert.alert("Error", "Failed to submit question. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Create New Question</Text>

      <TextInput
        placeholder="Enter your question"
        value={question}
        onChangeText={setQuestion}
        multiline
        className="border border-gray-300 rounded-md p-2 mb-4 min-h-[100px]"
      />

      <Text className="text-lg font-semibold mb-2">Answer Variants</Text>
      {variants.map((variant, index) => (
        <View key={index} className="mb-2">
          <Text>Variant {index + 1}</Text>
          <TextInput
            value={variant}
            onChangeText={(value) => handleVariantChange(index, value)}
            placeholder={`Enter variant ${index + 1}`}
            className="border border-gray-300 rounded-md p-2"
          />
        </View>
      ))}

      <View className="mt-4">
        <Text className="text-lg font-semibold mb-2">
          Select Correct Answer
        </Text>
        <Picker
          selectedValue={correctAnswer}
          onValueChange={(value: any) => setCorrectAnswer(Number(value))}
        >
          {variants.map((_, index) => (
            <Picker.Item
              key={index}
              label={`Variant ${index + 1}`}
              value={index}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-500 rounded-md p-3 mt-4"
      >
        <Text className="text-white text-center font-bold">
          Submit Question
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}