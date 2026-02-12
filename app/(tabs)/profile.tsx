import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '../../constants/Routes';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>User: Bon</Text>
      <Button 
        title="Go to Settings" 
        // No more typos possible!
        onPress={() => router.push(Routes.SETTINGS)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 10 },
});