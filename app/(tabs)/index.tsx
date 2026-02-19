import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, AccessibilityInfo } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Routes } from '../../constants/Routes';
import { MealStore, Meal } from '../../constants/MealStore';

const HorizontalBar = ({ progress, color }: { progress: number; color: string }) => (
  <View style={styles.barBg}>
    <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>(MealStore.getMeals());
  const [water, setWater] = useState(1.9);
  const waterGoal = 2.5;
  const waterPercentage = Math.round((water / waterGoal) * 100);

  useEffect(() => {
    const unsubscribe = MealStore.subscribe(() => {
      setMeals(MealStore.getMeals());
    });
    return unsubscribe;
  }, []);

  const addWater = () => setWater(prev => Math.min(prev + 0.1, waterGoal));
  const removeWater = () => setWater(prev => Math.max(prev - 0.1, 0));
  const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.profileSquare}>
              <Ionicons name="person" size={28} color="#00E5FF" />
            </View>
            <View>
              <Text style={styles.greetingText}>Hello Bon!</Text>
              <Text style={styles.subGreeting}>Let's track your health</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.calendarCircle} accessibilityLabel="Open Calendar">
            <Ionicons name="calendar" size={24} color="#00E5FF" />
          </TouchableOpacity>
        </View>

        {/* 1. Nutrients Tracker Card */}
        <Text style={styles.sectionTitle}>Nutrients Tracker</Text>
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push(Routes.TRACKER as any)}
          accessibilityRole="button"
        >
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>160/225</Text>
              <HorizontalBar progress={160/225} color="#00E5FF" />
              <Text style={styles.macroLabel}>Proteins</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>33/118</Text>
              <HorizontalBar progress={33/118} color="#00E676" />
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>320/340</Text>
              <HorizontalBar progress={320/340} color="#FFD600" />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
          </View>

          <View style={styles.calorieSection}>
            <Text style={styles.calValueText}>{totalCals} <Text style={styles.calGoalText}>/ 3400 kcal</Text></Text>
            <HorizontalBar progress={totalCals/3400} color="#00E676" />
          </View>
        </TouchableOpacity>

        {/* 2. Daily Water Intake Card */}
        <Text style={styles.sectionTitle}>Daily Water Intake</Text>
        <View style={styles.card}>
          <View style={styles.waterRow}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterLabelText}>Water Consumed</Text>
              <Text style={styles.waterMainVal}>{water.toFixed(1)} <Text style={styles.waterSubVal}>/ {waterGoal}L</Text></Text>
              <Text style={styles.hydrationStatus}>Hydration: {waterPercentage}%</Text>
            </View>

            <View style={styles.waterVisuals}>
              <View style={styles.waterButtons}>
                <TouchableOpacity style={styles.accCircleBtn} onPress={addWater} accessibilityLabel="Add 100ml water">
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.accCircleBtn} onPress={removeWater} accessibilityLabel="Remove 100ml water">
                  <Ionicons name="remove" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.waterPillBg}>
                <View style={[styles.waterPillFill, { height: `${waterPercentage}%` }]} />
                <Text style={styles.waterPercentText}>{waterPercentage}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 3. Meals Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Meals</Text>
          <TouchableOpacity 
            style={styles.addMealBtn} 
            onPress={() => router.push({ pathname: '/meal-details', params: { type: 'New Meal' } } as any)}
            accessibilityLabel="Add a new meal"
          >
            <Ionicons name="add" size={28} color="#0D1117" />
          </TouchableOpacity>
        </View>

        {meals.map((meal) => (
          <TouchableOpacity 
            key={meal.id} 
            style={styles.mealCard} 
            onPress={() => router.push({ pathname: '/meal-details', params: { type: meal.type } } as any)}
          >
            <View style={styles.mealLeft}>
              <View style={styles.mealIconBox}>
                <Ionicons name="restaurant" size={22} color="#00E5FF" />
              </View>
              <View>
                <Text style={styles.mealName}>{meal.type}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
            </View>
            <View style={styles.mealRight}>
              <Text style={styles.mealCalValue}>{meal.calories}</Text>
              <Text style={styles.mealCalLabel}>kcal</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' }, // High contrast Dark Background
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  
  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 25 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  profileSquare: { width: 52, height: 52, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderRadius: 12, borderWidth: 1, borderColor: '#30363D' },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subGreeting: { fontSize: 14, color: '#8B949E' },
  calendarCircle: { width: 44, height: 44, backgroundColor: '#161B22', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  
  // Titles
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 15, marginTop: 15, letterSpacing: 0.5 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 12 },
  
  // Accessibility Optimized Cards
  card: { backgroundColor: '#161B22', borderRadius: 20, padding: 22, marginBottom: 20, borderWidth: 1.5, borderColor: '#30363D' },
  barBg: { width: '100%', height: 10, backgroundColor: '#0D1117', borderRadius: 5, marginVertical: 10 },
  barFill: { height: '100%', borderRadius: 5 },

  // Macros
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  macroItem: { width: '30%', alignItems: 'center' },
  macroValue: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  macroLabel: { fontSize: 12, color: '#C9D1D9', marginTop: 6, fontWeight: '600' },
  calorieSection: { alignItems: 'center', marginTop: 10 },
  calValueText: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  calGoalText: { fontSize: 16, color: '#8B949E', fontWeight: '400' },

  // Water
  waterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterInfo: { flex: 1 },
  waterLabelText: { fontSize: 14, color: '#8B949E', fontWeight: 'bold', marginBottom: 4 },
  waterMainVal: { fontSize: 36, fontWeight: '900', color: '#00E5FF' },
  waterSubVal: { fontSize: 18, color: '#C9D1D9' },
  hydrationStatus: { fontSize: 13, color: '#00E676', marginTop: 8, fontWeight: 'bold' },
  waterVisuals: { flexDirection: 'row', alignItems: 'center' },
  waterButtons: { justifyContent: 'space-between', height: 110, marginRight: 20 },
  accCircleBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#21262D', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  waterPillBg: { width: 56, height: 120, backgroundColor: '#0D1117', borderRadius: 28, justifyContent: 'flex-end', overflow: 'hidden', borderWidth: 2, borderColor: '#30363D' },
  waterPillFill: { width: '100%', backgroundColor: '#00E5FF' },
  waterPercentText: { position: 'absolute', width: '100%', textAlign: 'center', bottom: '45%', fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' },

  // Meals
  addMealBtn: { width: 48, height: 48, backgroundColor: '#00E676', borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  mealCard: { backgroundColor: '#161B22', borderRadius: 18, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  mealLeft: { flexDirection: 'row', alignItems: 'center' },
  mealIconBox: { width: 48, height: 48, backgroundColor: '#0D1117', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mealName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  mealTime: { fontSize: 14, color: '#8B949E', marginTop: 2 },
  mealRight: { alignItems: 'flex-end' },
  mealCalValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  mealCalLabel: { fontSize: 12, color: '#8B949E', fontWeight: 'bold' }
});