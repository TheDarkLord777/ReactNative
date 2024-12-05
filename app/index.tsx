import { Link } from "expo-router";
import { View, Image } from "react-native";

export default function Index() {
  return (
    <View className="h-full w-full flex-1 items-center justify-center">
      <Image
        source={require('../assets/images/eagle.png')}
        className="w-64 h-64 mb-10"
      />
      <Link
        className="bg-black text-white w-80 h-12 text-center rounded-md text-xl font-bold flex items-center justify-center leading-[48px]"
        href="/RoomCreatePage"
      >
        Create
      </Link>
      <Link
        className="bg-slate-600 text-white w-80 h-12 my-10 text-center rounded-md text-xl font-bold flex items-center justify-center leading-[48px]"
        href="/RoomAccessPage"
      >
        Enter the room
      </Link>
    </View>
  );
}