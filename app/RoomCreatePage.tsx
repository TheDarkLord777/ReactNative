import React, { useRef, useState, useEffect } from "react";
import { View, Animated, Easing, Text, Button } from "react-native";

export default function RoomCreatePage() {
  const [finalNumber, setFinalNumber] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const animatedValues = useRef(Array(6).fill(0).map(() => new Animated.Value(0))).current;

  const generateRoomNumber = (): string => {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
  };

  const startAnimation = () => {
    if (isAnimating) return;

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
        })
      ]);
    });

    Animated.parallel(animations).start(() => {
      setIsAnimating(false);
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

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
        {animatedValues.map((animValue, index) => renderDigitBox(animValue, index))}
      </View>
      <Button
        title="Create"
        onPress={startAnimation}
        disabled={isAnimating}
        color="#3b82f6"
      />
    </View>
  );
}