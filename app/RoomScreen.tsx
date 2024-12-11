import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams();

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Room: {roomId}</Text>
    </View>
  );
}