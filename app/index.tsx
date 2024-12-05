import { Link } from "expo-router";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="h-full w-full flex-1 items-center justify-center">
      <Link
        className="bg-black text-white w-40 h-6  text-center rounded-md"
        href="/dashboard"
      >
        Go Dashboard
      </Link>
    </View>
  );
}
