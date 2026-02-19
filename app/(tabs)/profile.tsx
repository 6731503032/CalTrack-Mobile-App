import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root}>
      {/* Ensures status bar icons are white */}
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
      
      {/* FIXED HEADER: Now with proper spacing */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Go back">
          <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Ionicons name="person" size={60} color="#8B949E" />
          </View>
          <Text style={styles.userName}>BON</Text>
          <Text style={styles.userEmail}>bon@gmail.com</Text>
        </View>

        {/* Action Card: My Info */}
        <TouchableOpacity style={styles.primaryCard} activeOpacity={0.8}>
          <Text style={styles.primaryCardText}>My Info</Text>
          <View style={styles.row}>
            <Text style={styles.editLabel}>Edit</Text>
            <Ionicons name="chevron-forward" size={18} color="#0D1117" />
          </View>
        </TouchableOpacity>

        {/* Data Cards using your specific colors */}
        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>Daily Calorie Goal</Text>
          <Text style={[styles.dataValue, { color: '#00E676' }]}>3400 Cal</Text>
        </View>

        <View style={styles.dataCard}>
          <Text style={styles.dataLabel}>Daily Water Goal</Text>
          <Text style={[styles.dataValue, { color: '#00E5FF' }]}>2500 ml</Text>
        </View>

        {/* Menu List */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="mail-outline" size={22} color="#00E676" style={styles.menuIcon} />
            <Text style={styles.menuText}>Contact us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={22} color="#00E676" style={styles.menuIcon} />
            <Text style={styles.menuText}>About app</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomWidth: 0 }]} 
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#00E676" style={styles.menuIcon} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#0D1117', // High contrast background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    marginTop: 5 // Gives the title space from the very top edge
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#FFFFFF' // Pure White headings
  },
  backBtn: { padding: 5 },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  profileSection: { alignItems: 'center', marginVertical: 30 },
  avatarWrapper: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    backgroundColor: '#161B22', // Card background
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#30363D', // Border color
    marginBottom: 15
  },
  userName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  userEmail: { fontSize: 16, color: '#C9D1D9', marginTop: 4 }, // Light Gray subtext

  primaryCard: { 
    backgroundColor: '#00E676', // Lime Green
    borderRadius: 16, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
    height: 64, 
  },
  primaryCardText: { color: '#0D1117', fontSize: 18, fontWeight: 'bold' },
  editLabel: { color: '#0D1117', fontSize: 16, fontWeight: '600', marginRight: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },

  dataCard: { 
    backgroundColor: '#161B22', 
    borderRadius: 16, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#30363D',
    height: 64
  },
  dataLabel: { color: '#C9D1D9', fontSize: 16, fontWeight: '500' },
  dataValue: { fontSize: 18, fontWeight: 'bold' },

  menuContainer: { 
    marginTop: 20, 
    backgroundColor: '#161B22', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#30363D',
    overflow: 'hidden'
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, // Large touch target
    borderBottomWidth: 1, 
    borderBottomColor: '#30363D' 
  },
  menuIcon: { marginRight: 15 },
  menuText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});