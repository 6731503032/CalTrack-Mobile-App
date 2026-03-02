import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        // Using Cyan (#00E5FF) for the active tab to match your theme
        tabBarActiveTintColor: '#00E5FF', 
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#0D1117', // High contrast Dark Background
          borderTopWidth: 1,
          borderTopColor: '#30363D', // Your border color choice
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        // Increased touch targets for accessibility
        tabBarItemStyle: {
          height: 50,
        }
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="food_database" 
        options={{ 
          title: 'Food Info', 
          tabBarLabel: 'Database',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "book" : "book-outline"} size={24} color={color} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="tracker" 
        options={{ 
          title: 'Tracker', 
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={24} color={color} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle" : "person-circle-outline"} size={24} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}