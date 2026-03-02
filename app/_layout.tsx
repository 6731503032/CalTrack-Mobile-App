import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MealStore } from '../constants/MealStore';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // 1. Explicitly load font assets (Essential for Web Localhost)
        await Font.loadAsync({
          SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
          ...Ionicons.font,
          ...MaterialIcons.font,
          ...FontAwesome.font,
        });

        // 2. Hydrate the MealStore
        await MealStore.hydrate();
      } catch (e) {
        console.warn("Initialization Error:", e);
      } finally {
        // Tell the app to render and hide splash
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, { width: isWeb ? 400 : '100%' }]}>
        <Stack
          screenOptions={{
            headerShown: false,
            // Uses your #0D1117 background for screen transitions
            contentStyle: { backgroundColor: '#0D1117' },
          }}
        >
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="meal-details" />
          <Stack.Screen name="food-picker" />
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
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#30363D', // Your custom border color
  },
});