import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { roomService } from "./services/roomService";
import { useRouter } from "expo-router";

export default function RoomAccessPage() {
  const [roomCode, setRoomCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleRoomCode = (text: string) => {
    let formattedText = text.toUpperCase();
    if (text.length === 3 && !text.includes(" ")) {
      formattedText = formattedText + " ";
    }
    setRoomCode(formattedText);
  };

  const handleRoomAccess = async () => {
    try {
      setIsLoading(true);
      console.log('1. Starting room access with code:', roomCode);

      const cleanRoomCode = roomCode.replace(" ", "");
      console.log('2. Clean room code:', cleanRoomCode);

      const response = await roomService.getRoomIdByCode(cleanRoomCode);
      console.log('3. API Response:', response);

      const roomId = response.data.id;

      console.log('4. Attempting navigation...');
      router.push({
        pathname: "/TestPage",
        params: { roomId: roomId.toString() }
      });
      console.log('5. Navigation completed');

    } catch (error) {
      console.error('Navigation error details:', error);
      Alert.alert("Error", "Navigation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="h-full w-full flex-1 items-center justify-center">
      <TextInput
        className="bg-slate-200 my-5 w-[250px] px-4 rounded-lg border-2 border-blue-400 shadow-lg shadow-blue/25 text-lg font-bold"
        placeholder="Enter the room code..."
        placeholderTextColor="silver"
        keyboardType="default"
        scrollEnabled={false}
        maxLength={7}
        autoCapitalize="characters"
        value={roomCode}
        onChangeText={handleRoomCode}
      />
      <Button
        title={isLoading ? "Accessing..." : "Enter"}
        onPress={handleRoomAccess}
        disabled={isLoading || roomCode.length < 6}
      />
    </View>
  );
}