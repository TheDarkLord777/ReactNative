import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      {/* Teacher Pages */}
      <Stack.Screen name="RoomCreatePage" options={{ title: "Create Room" }} />
      <Stack.Screen name="TeacherQuestionPage" options={{ title: "Manage Questions" }} />
      <Stack.Screen name="TeacherDashboardPage" options={{ title: "Dashboard" }} />
      <Stack.Screen name="UserInput" options={{ title: "Username" }} />
      
      {/* Student Pages */}
      <Stack.Screen name="RoomAccessPage" options={{ title: "Enter Room" }} />
      <Stack.Screen name="TestPage" options={{ title: "Test" }} />
      <Stack.Screen name="ResultPage" options={{ title: "Results" }} />
     
      
      {/* Common */}
      <Stack.Screen name="RoomScreen" options={{ title: "Room" }} />

    </Stack>
  );
}