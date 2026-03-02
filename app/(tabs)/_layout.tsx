import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#00E5FF', // Your Cyan
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#0D1117', // High contrast Background
          borderTopWidth: 1,
          borderTopColor: '#30363D', // Your border color
          height: isWeb ? 70 : 65,
          paddingBottom: 10,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarItemStyle: {
          height: 55, // Increased touch targets for accessibility
        }
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
          // Use -outline for consistency in modern Ionicons v7
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
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
          // 'stats-chart-outline' is the v7 name to prevent rectangles
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart-outline" size={24} color={color} />,
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }} 
      />
    </Tabs>
  );
}