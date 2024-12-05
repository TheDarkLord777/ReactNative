import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="RoomCreatePage" options={{ title: "Create room  " }} />
      <Stack.Screen name="RoomAccessPage" options={{ title: "Access room " }} />
    </Stack>
  );
}
