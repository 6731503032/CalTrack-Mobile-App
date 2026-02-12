import { Tabs } from 'expo-router';
import { Routes } from '@/constants/Routes'; // Using your new alias/enum

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      tabBarActiveTintColor: '#007AFF', // Optional: adds a standard blue for active tabs
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home' 
        }} 
      />
      <Tabs.Screen 
        name="tracker" 
        options={{ 
          title: 'Detailed View', 
          tabBarLabel: 'Tracker' 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarLabel: 'Profile' 
        }} 
      />
    </Tabs>
  );
}