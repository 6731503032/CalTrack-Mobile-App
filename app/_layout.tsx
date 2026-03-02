import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MealStore } from '../constants/MealStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isWeb = Platform.OS === 'web';
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // --- THE ONLY FIX FOR FIREBASE ICONS ---
        if (isWeb && typeof document !== 'undefined') {
          const style = document.createElement('style');
          style.innerHTML = `
            @font-face {
              font-family: 'Ionicons';
              src: url('https://cdn.jsdelivr.net/npm/@expo/vector-icons@latest/dist/vendor/react-native-vector-icons/Fonts/Ionicons.ttf');
            }
          `;
          document.head.appendChild(style);
        }

        await Promise.all([
          Font.loadAsync({
            ...Ionicons.font,
            ...MaterialIcons.font,
            ...FontAwesome.font,
          }),
          // Catch hydration errors so they don't block the UI
          MealStore.hydrate().catch(e => console.log("Store failed", e))
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, { width: isWeb ? 400 : '100%' }]}>
        <Stack screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: '#0D1117' } 
        }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0D1117', // Your preference
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#0D1117',
    borderColor: '#30363D', // Your custom border
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
  },
});