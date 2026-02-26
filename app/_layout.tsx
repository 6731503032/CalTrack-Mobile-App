import { Stack } from "expo-router";
import { Platform, View } from "react-native";

export default function RootLayout() {
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={{
        flex: 1,
        alignItems: isWeb ? "center" : "stretch",
        backgroundColor: "#0B1220",
      }}
    >
      <View
        style={{
          flex: 1,
          width: isWeb ? 400 : "100%",
        }}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}