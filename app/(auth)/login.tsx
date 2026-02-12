import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '../../constants/Routes'; // Import the Enum

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CalTrack</Text>
      <Button 
        title="Sign In" 
        // Use the Enum instead of a hardcoded string
        onPress={() => router.replace(Routes.TABS)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});