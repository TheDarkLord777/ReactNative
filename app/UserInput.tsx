import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View, ActivityIndicator } from "react-native";
import { roomService } from "./services/roomService";

export default function UserInput() {
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateTeacher = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Please enter username");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create teacher via API
      const response = await roomService.createUser(username);
      
      // Save teacher ID and username
      await AsyncStorage.setItem("teacherId", ((response.data as any).data.id).toString());
      await AsyncStorage.setItem("teacherName", username);

      // Navigate back to room creation
      router.back();
    } catch (error: any) {
      console.error("Error creating teacher:", error);
      Alert.alert(
        "Error", 
        error?.response?.data?.message || "Failed to create teacher account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <TextInput
        value={username}
        onChangeText={setUsername}
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Enter teacher name..."
        editable={!isLoading}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <Button 
          title="Create Teacher Account" 
          onPress={handleCreateTeacher}
          disabled={!username.trim()}
        />
      )}
    </View>
  );
}
