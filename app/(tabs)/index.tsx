import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Routes } from '@/constants/Routes';

const ProgressBar = ({ progress, color }: { progress: number; color: string }) => (
  <View style={styles.progressBg}>
    <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
  </View>
);

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>B</Text>
          </View>
          <View>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.userName}>Bon!</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Nutrients</Text>
          <TouchableOpacity onPress={() => router.push(Routes.TRACKER)}>
            <Text style={styles.seeMore}>Details</Text>
          </TouchableOpacity>
        </View>

        {/* Main Nutrient Card */}
        <TouchableOpacity 
          style={styles.card} 
          activeOpacity={0.9} 
          onPress={() => router.push(Routes.TRACKER)}
        >
          {/* Main Calories Section - Put this first for Hierarchy */}
          <View style={styles.mainCalorieRow}>
             <View>
                <Text style={styles.calorieValue}>2,400</Text>
                <Text style={styles.calorieTotal}>of 3,400 kcal</Text>
             </View>
             <View style={styles.percentageCircle}>
                <Text style={styles.percentageText}>70%</Text>
             </View>
          </View>
          
          <ProgressBar progress={2400/3400} color="#2ECC71" />

          <View style={styles.divider} />

          {/* Macros Grid */}
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Proteins</Text>
              <Text style={[styles.macroValueSmall, {color: '#FF8A00'}]}>160g</Text>
              <ProgressBar progress={160/225} color="#FF8A00" />
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={[styles.macroValueSmall, {color: '#4CD964'}]}>33g</Text>
              <ProgressBar progress={33/118} color="#4CD964" />
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={[styles.macroValueSmall, {color: '#FF3B30'}]}>320g</Text>
              <ProgressBar progress={320/340} color="#FF3B30" />
            </View>
          </View>

          <Text style={styles.lastUpdate}>Updated 5 mins ago</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F4F7', // Slightly cooler, modern grey
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  profileCircle: {
    width: 55,
    height: 55,
    borderRadius: 18, // Squircle look
    backgroundColor: '#007AFF',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  profileInitial: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  greetingText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeMore: {
    color: '#007AFF',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24, // Softer corners
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  mainCalorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  calorieTotal: {
    fontSize: 14,
    color: '#888',
    marginTop: -4,
  },
  percentageCircle: {
    backgroundColor: '#F2F4F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  percentageText: {
    fontWeight: '700',
    color: '#2ECC71',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    width: '30%',
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 4,
  },
  macroValueSmall: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  lastUpdate: {
    fontSize: 11,
    color: '#CCC',
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});