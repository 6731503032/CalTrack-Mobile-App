// app/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GoalStore } from '../constants/GoalStore';
import { MealStore } from '../constants/MealStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded || error) {
      Promise.all([
        MealStore.hydrate().catch(e => console.log("MealStore failed", e)),
        GoalStore.hydrate().catch(e => console.log("GoalStore failed", e)),
      ]).finally(() => SplashScreen.hideAsync());
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, { width: Platform.OS === 'web' ? 400 : '100%' }]}>
        <Stack screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0D1117' }
        }}>
          {/* EXPLICITLY DEFINE YOUR ROUTES HERE */}
          <Stack.Screen name="index" /> 
          <Stack.Screen name="setup_name" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0D1117',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0D1117',
    borderColor: '#30363D',
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    overflow: 'hidden',
  },
});
//