import { Button, Text, TextInput, View } from "react-native";

export default function RoomAccessPage() {
  return (
    <View className="h-full w-full flex-1 items-center justify-center">
     
      <TextInput 
        className="bg-slate-200 my-5 w-[250px] px-4 rounded-lg border-2 border-blue-400 shadow-lg shadow-blue/25 text-lg font-bold"
        placeholder="    Enter the room code..."
        placeholderTextColor="silver"
        keyboardType="default"
        scrollEnabled={false}
        maxLength={7}
        autoCapitalize="characters"
        onChangeText={(text) => {
          if (text.length === 3) {
            text = text + " ";
          }
        }}
      />
      <Button title="Enter"></Button>
    </View>
  );
}