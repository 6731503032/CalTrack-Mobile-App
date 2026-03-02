import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Meal, MealStore } from '../../constants/MealStore';
import { Routes } from '../../constants/Routes';

// --- Daily goals ---
const GOALS = { calories: 3400, protein: 225, fats: 118, carbs: 340, water: 2.5 };

const HorizontalBar = ({ progress, color }: { progress: number; color: string }) => (
  <View style={styles.barBg}>
    <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>(MealStore.getMeals());
  const [water, setWater] = useState<number>(0);

  useEffect(() => {
    // Subscribe to meal store changes only — fonts already loaded by _layout.tsx
    const unsub = MealStore.subscribe(() => setMeals(MealStore.getMeals()));
    return unsub;
  }, []);

  // --- Derived totals (live from real meal data) ---
  const totalCals    = meals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein  ?? 0), 0);
  const totalFats    = meals.reduce((s, m) => s + (m.fat      ?? 0), 0);
  const totalCarbs   = meals.reduce((s, m) => s + (m.carbs    ?? 0), 0);

  // --- Water ---
  const waterPercentage = Math.round((water / GOALS.water) * 100);
  const addWater    = () => setWater((p) => Math.min(+(p + 0.1).toFixed(1), GOALS.water));
  const removeWater = () => setWater((p) => Math.max(+(p - 0.1).toFixed(1), 0));

  // --- Delete meal (long press) ---
  const handleDeleteMeal = (meal: Meal) => {
    Alert.alert(
      `Delete "${meal.type}"?`,
      'This will remove the meal and update your daily totals.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await MealStore.removeMeal(meal.id);
          },
        },
      ]
    );
  };

  const handleAddMeal = () => router.push('/meal-details' as any);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* --- Header --- */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.profileSquare}>
              <Ionicons name="person-circle-sharp" size={32} color="#00E5FF" />
            </View>
            <View>
              <Text style={styles.greetingText}>Hello Bon!</Text>
              <Text style={styles.subGreeting}>Let's track your health</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.calendarCircle} onPress={() => router.push(Routes.TRACKER as any)}>
            <Ionicons name="calendar-sharp" size={24} color="#00E5FF" />
          </TouchableOpacity>
        </View>

        {/* --- Nutrients Tracker (live) --- */}
        <Text style={styles.sectionTitle}>Nutrients Tracker</Text>
        <TouchableOpacity style={styles.card} onPress={() => router.push(Routes.TRACKER as any)}>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(totalProtein)}/{GOALS.protein}</Text>
              <HorizontalBar progress={totalProtein / GOALS.protein} color="#00E5FF" />
              <Text style={styles.macroLabel}>Proteins</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(totalFats)}/{GOALS.fats}</Text>
              <HorizontalBar progress={totalFats / GOALS.fats} color="#00E676" />
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(totalCarbs)}/{GOALS.carbs}</Text>
              <HorizontalBar progress={totalCarbs / GOALS.carbs} color="#FFD600" />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
          </View>
          <View style={styles.calorieSection}>
            <Text style={styles.calValueText}>
              {totalCals} <Text style={styles.calGoalText}>/ {GOALS.calories} Cal</Text>
            </Text>
            <HorizontalBar progress={totalCals / GOALS.calories} color="#00E676" />
          </View>
        </TouchableOpacity>

        {/* --- Water Intake --- */}
        <Text style={styles.sectionTitle}>Daily Water Intake</Text>
        <View style={styles.card}>
          <View style={styles.waterRow}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterLabelText}>Water Consumed</Text>
              <Text style={styles.waterMainVal}>{water.toFixed(1)} <Text style={styles.waterSubVal}>/ {GOALS.water}L</Text></Text>
              <Text style={styles.hydrationStatus}>Hydration: {waterPercentage}%</Text>
            </View>
            <View style={styles.waterVisuals}>
              <View style={styles.waterButtons}>
                <TouchableOpacity style={styles.accCircleBtn} onPress={addWater}>
                  <Ionicons name="add-circle" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.accCircleBtn} onPress={removeWater}>
                  <Ionicons name="remove-circle" size={30} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.waterPillBg}>
                <View style={[styles.waterPillFill, { height: `${waterPercentage}%` }]} />
                <Text style={styles.waterPercentText}>{waterPercentage}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- Daily Meals --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Meals</Text>
          <TouchableOpacity style={styles.addMealBtn} onPress={handleAddMeal}>
            <Ionicons name="add-sharp" size={35} color="#0D1117" />
          </TouchableOpacity>
        </View>

        {meals.length === 0 && (
          <View style={styles.emptyMeals}>
            <Ionicons name="restaurant-outline" size={36} color="#8B949E" />
            <Text style={styles.emptyMealsText}>No meals logged yet</Text>
            <Text style={styles.emptyMealsSubText}>Tap + to add your first meal</Text>
          </View>
        )}

        {meals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            style={styles.mealCard}
            onLongPress={() => handleDeleteMeal(meal)}
            delayLongPress={400}
          >
            <View style={styles.mealLeft}>
              <View style={styles.mealIconBox}>
                <Ionicons name="restaurant-sharp" size={22} color="#00E5FF" />
              </View>
              <View>
                <Text style={styles.mealName}>{meal.type}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
            </View>
            <View style={styles.mealRight}>
              <Text style={styles.mealCalValue}>{meal.calories}</Text>
              <Text style={styles.mealCalLabel}>Cal</Text>
            </View>
          </TouchableOpacity>
        ))}

        {meals.length > 0 && (
          <Text style={styles.deleteHint}>Long press a meal to delete it</Text>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 25 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  profileSquare: { width: 52, height: 52, backgroundColor: '#161B22', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderRadius: 12, borderWidth: 1, borderColor: '#30363D' },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  subGreeting: { fontSize: 14, color: '#8B949E' },
  calendarCircle: { width: 44, height: 44, backgroundColor: '#161B22', borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 15, marginTop: 15 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 12 },
  card: { backgroundColor: '#161B22', borderRadius: 20, padding: 22, marginBottom: 20, borderWidth: 1.5, borderColor: '#30363D' },
  barBg: { width: '100%', height: 10, backgroundColor: '#0D1117', borderRadius: 5, marginVertical: 10 },
  barFill: { height: '100%', borderRadius: 5 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  macroItem: { width: '30%', alignItems: 'center' },
  macroValue: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF' },
  macroLabel: { fontSize: 12, color: '#C9D1D9', marginTop: 6, fontWeight: '600' },
  calorieSection: { alignItems: 'center', marginTop: 10 },
  calValueText: { fontSize: 32, fontWeight: '900', color: '#FFFFFF' },
  calGoalText: { fontSize: 16, color: '#8B949E' },
  waterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterInfo: { flex: 1 },
  waterLabelText: { fontSize: 14, color: '#8B949E', fontWeight: 'bold', marginBottom: 4 },
  waterMainVal: { fontSize: 36, fontWeight: '900', color: '#00E5FF' },
  waterSubVal: { fontSize: 18, color: '#C9D1D9' },
  hydrationStatus: { fontSize: 13, color: '#00E676', marginTop: 8, fontWeight: 'bold' },
  waterVisuals: { flexDirection: 'row', alignItems: 'center' },
  waterButtons: { justifyContent: 'space-between', height: 110, marginRight: 20 },
  accCircleBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#21262D', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  waterPillBg: { width: 56, height: 120, backgroundColor: '#0D1117', borderRadius: 28, justifyContent: 'flex-end', overflow: 'hidden', borderWidth: 2, borderColor: '#30363D' },
  waterPillFill: { width: '100%', backgroundColor: '#00E5FF' },
  waterPercentText: { position: 'absolute', width: '100%', textAlign: 'center', bottom: '45%', fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' },
  addMealBtn: { width: 56, height: 56, backgroundColor: '#00E676', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  mealCard: { backgroundColor: '#161B22', borderRadius: 18, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  mealLeft: { flexDirection: 'row', alignItems: 'center' },
  mealIconBox: { width: 48, height: 48, backgroundColor: '#0D1117', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mealName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  mealTime: { fontSize: 14, color: '#8B949E', marginTop: 2 },
  mealRight: { alignItems: 'flex-end' },
  mealCalValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  mealCalLabel: { fontSize: 12, color: '#8B949E', fontWeight: 'bold' },
  emptyMeals: { alignItems: 'center', paddingVertical: 40 },
  emptyMealsText: { color: '#C9D1D9', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  emptyMealsSubText: { color: '#8B949E', fontSize: 13, marginTop: 4 },
  deleteHint: { textAlign: 'center', color: '#30363D', fontSize: 12, marginTop: 4, marginBottom: 8 },
});