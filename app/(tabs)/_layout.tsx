import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#00E5FF', // Cyan for active state
        tabBarInactiveTintColor: '#8B949E', // Light Gray subtext
        tabBarStyle: {
          backgroundColor: '#0D1117', // High contrast Background
          borderTopWidth: 1,
          borderTopColor: '#30363D', // Border color for cards/buttons
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
      {/* REMOVED: <Tabs.Screen name="index" /> 
          Because app/index.tsx is at the root level, NOT inside the (tabs) folder.
          Including it here causes the "No route named index" build error.
      */}

      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
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