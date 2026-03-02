import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const isWeb = Platform.OS === 'web';

  // WEB FIX: Force icons to load from CDN on localhost
  useEffect(() => {
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
  }, []);

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#00E5FF', // Your Cyan preference
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#0D1117', // High contrast Background
          borderTopWidth: 1,
          borderTopColor: '#30363D', // Your border color
          height: isWeb ? 70 : 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 0,
          // Removed 'borderTopStyle' - it was causing the crash
        },
        tabBarItemStyle: {
          height: 55, // Increased touch targets for accessibility
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }} 
      />

      <Tabs.Screen 
        name="food_database" 
        options={{ 
          title: 'Food Info', 
          tabBarLabel: 'Database',
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={24} color={color} />,
        }} 
      />

      <Tabs.Screen 
        name="tracker" 
        options={{ 
          title: 'Tracker', 
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={24} color={color} />,
        }} 
      />
    </Tabs>
  );
}