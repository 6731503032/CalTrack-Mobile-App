import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoalStore } from '../constants/GoalStore';

export default function SetupNameScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSave = async () => {
    if (name.trim().length < 2) return;
    
    // Update the store with the new name
    const currentGoals = GoalStore.getGoals();
    await GoalStore.setGoals({ ...currentGoals, name: name.trim() });
    
    // Send them to the tabs (Home)
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={80} color="#00E5FF" />
        <Text style={styles.title}>What should we call you?</Text>
        <Text style={styles.subtitle}>This will be displayed on your profile and home screen.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#8B949E"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <TouchableOpacity 
          style={[styles.button, name.trim().length < 2 && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={name.trim().length < 2}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#0D1117" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1117' },
  content: { flex: 1, padding: 30, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', marginTop: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#C9D1D9', textAlign: 'center', marginTop: 10, marginBottom: 30 },
  input: { 
    width: '100%', 
    height: 60, 
    backgroundColor: '#161B22', 
    borderRadius: 12, 
    paddingHorizontal: 20, 
    color: '#FFFFFF', 
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#30363D'
  },
  button: { 
    flexDirection: 'row', 
    backgroundColor: '#00E676', 
    width: '100%', 
    height: 56, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 20,
    gap: 8 
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#0D1117', fontSize: 18, fontWeight: 'bold' },
});