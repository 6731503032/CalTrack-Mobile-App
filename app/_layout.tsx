import { Stack } from 'expo-router';
//This handles the high-level switching between the authentication flow and the main application.
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The initial route is defined by the order or explicit initialRouteName */}
      <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
