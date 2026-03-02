import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Font from 'expo-font';

export default function ProfileScreen() {
  const router = useRouter();
  const user = { name: "BON", email: "bon@example.com" };
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      try {
        await Font.loadAsync(Ionicons.font);
      } catch (e) {
        console.warn("Font loading failed, but continuing render...");
      } finally {
        setLoaded(true);
      }
    }
    loadResources();
  }, []);

  if (!loaded) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#00E5FF" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back-sharp" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person-sharp" size={60} color="#8B949E" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <TouchableOpacity 
          style={styles.primaryCard} 
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.primaryCardText}>My Info</Text>
          <View style={styles.row}>
            <Text style={styles.editLabel}>Edit</Text>
            <Ionicons name="chevron-forward-sharp" size={18} color="#0D1117" />
          </View>
        </TouchableOpacity>

        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>Daily Calorie Goal</Text>
          <Text style={[styles.dataValue, { color: '#00E676' }]}>3400 Cal</Text>
        </View>

        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>Daily Water Goal</Text>
          <Text style={[styles.dataValue, { color: '#00E5FF' }]}>2500 ml</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="mail-outline" size={22} color="#00E676" style={styles.menuIcon} />
            <Text style={styles.menuText}>Contact us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/(auth)/login')}>
            <Ionicons name="log-out-outline" size={22} color="#FF5252" style={styles.menuIcon} />
            <Text style={[styles.menuText, { color: '#FF5252' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  backBtn: { padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  profileSection: { alignItems: 'center', marginVertical: 30 },
  avatarWrapper: { 
    width: 110, height: 110, borderRadius: 55, backgroundColor: '#161B22', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#30363D' 
  },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  userEmail: { fontSize: 16, color: '#C9D1D9', marginTop: 4 },
  primaryCard: { 
    backgroundColor: '#00E676', borderRadius: 16, padding: 20, 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 64 
  },
  primaryCardText: { color: '#0D1117', fontSize: 18, fontWeight: 'bold' },
  editLabel: { color: '#0D1117', fontSize: 16, fontWeight: '600', marginRight: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  dataCard: { 
    backgroundColor: '#161B22', borderRadius: 16, padding: 20, marginTop: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 64,
    borderWidth: 1, borderColor: '#30363D'
  },
  dataLabel: { color: '#C9D1D9', fontSize: 16 },
  dataValue: { fontSize: 18, fontWeight: 'bold' },
  menuContainer: { marginTop: 20, backgroundColor: '#161B22', borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#30363D' },
  menuIcon: { marginRight: 15 },
  menuText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
