import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MealStore } from '../constants/MealStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // useFonts is SSR-safe and won't look for 'document.body'
  const [loaded, error] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...FontAwesome.font,
    // Direct CDN override to fix the "Wrong Icons" mapping
    'Ionicons': 'https://unpkg.com/ionicons@7.1.0/dist/fonts/ionicons.ttf',
  });

  useEffect(() => {
    if (loaded || error) {
      MealStore.hydrate()
        .catch(e => console.log("Store failed", e))
        .finally(() => SplashScreen.hideAsync());
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
    borderColor: '#30363D', // Your custom border preference
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    overflow: 'hidden',
  },
});