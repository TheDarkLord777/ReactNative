import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Button, Easing, View } from "react-native";
import { roomService } from "./services/roomService";
import { RoomCreationResponse } from "./types";

export default function RoomCreatePage() {
  const router = useRouter();
  const [finalNumber, setFinalNumber] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isCheckingTeacher, setIsCheckingTeacher] = useState(true);

  const animatedValues = useRef(
    Array(6)
      .fill(0)
      .map(() => new Animated.Value(0))
  ).current;
  
  

  useEffect(() => {
    const getUserId = async () => {
      try {
        setIsCheckingTeacher(true);
        const storedUserId = await AsyncStorage.getItem("teacherId");
        console.log("Stored userId:", storedUserId); // Debug log
  
        if (storedUserId) {
          setUserId(parseInt(storedUserId));
          console.log("UserId set:", parseInt(storedUserId)); // Debug log
        } else {
          router.push("/UserInput");
        }
      } catch (error) {
        console.error("getUserId error:", error); // Debug log
        Alert.alert("Error", "Failed to get teacher information");
      } finally {
        setIsCheckingTeacher(false);
      }
    };
  
    getUserId();
  }, []);

  const generateRoomNumber = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleCreateRoom = async (roomNumber: string) => {
    if (!userId) return;

    try {
      setIsLoading(true);

      let response: RoomCreationResponse | undefined;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          response = await roomService.createRoom(userId, roomNumber) as RoomCreationResponse;
          console.log("UserIdInRoot",userId)
          console.log("UserIdInRoot",roomNumber)
          break; // Success, exit loop
        } catch (error: any) {
          if (error.response?.data?.error?.code === 'ROOM_CREATION_FAILED') {
            attempts++;
            console.log(`Room creation attempt ${attempts} failed. Retrying...`);
          } else {
            throw error; // Re-throw other types of errors
          }
        }
      }

      if (!response) {
        throw new Error('Failed to create room after multiple attempts');
      }

      const roomId = response.data.id;
      console.log("Response roomId:",roomId)

      Alert.alert("Success", "Room created successfully!", [
        {
          text: "Add Questions",
          onPress: () =>
            router.push({
              pathname: "/TeacherQuestionPage",
              params: {
                roomId: response.data.id.toString(), // Ensure roomId is passed as string
                roomCode: response.data.room_code,
              },
            }),
        },
      ]);    
    } catch (error: any) {
      console.error("Room creation error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create room. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startAnimation = () => {
    if (isAnimating) {
      console.log('Animation already running');
      return;
    }

    const newNumber = generateRoomNumber();
    setFinalNumber(newNumber);
    setIsAnimating(true);

    const animations = animatedValues.map((animValue, index) => {
      return Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1500 + index * 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      setIsAnimating(false);
      handleCreateRoom(newNumber); // Pass the generated number to handleCreateRoom
    });
  };

  useEffect(() => {
    if (userId) {
      startAnimation();
    }
  }, [userId]);

  const renderDigitBox = (animValue: Animated.Value, index: number) => {
    return (
      <View
        key={index}
        className={`border-2 border-gray-300 rounded-lg p-4 overflow-hidden ${
          index === 2 ? "mr-4" : ""
        }`}
      >
        <Animated.Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            textAlign: "center",
            transform: [
              {
                translateY: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 400],
                }),
              },
            ],
          }}
          className="text-gray-700"
        >
          {finalNumber[index] || "0"}
        </Animated.Text>
      </View>
    );
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      <View className="flex-row gap-2 mb-6">
        {animatedValues.map((animValue, index) =>
          renderDigitBox(animValue, index)
        )}
      </View>
      <Button
        title={isLoading ? "Creating..." : "Try again"}
        onPress={startAnimation}
        disabled={isAnimating || isLoading || !userId}
        color="#3b82f6"
      />
    </View>
  );
}