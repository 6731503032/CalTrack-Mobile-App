import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: '#2ECC71', 
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF',
        }
      }}
    >
      {/* 1. LEFT-MOST: Home */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }} 
      />

      {/* 2. MIDDLE-LEFT: Food Database */}
      <Tabs.Screen 
        name="food_database" 
        options={{ 
          title: 'Food Info', 
          tabBarLabel: 'Database',
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={24} color={color} />,
        }} 
      />

      {/* 3. MIDDLE-RIGHT: Tracker */}
      <Tabs.Screen 
        name="tracker" 
        options={{ 
          title: 'Tracker', 
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />,
        }} 
      />

      {/* 4. FAR-RIGHT: Profile */}
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