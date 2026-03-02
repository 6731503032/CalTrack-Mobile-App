import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GoalStore, UserGoals } from '../../constants/GoalStore';
import { Meal, MealStore } from '../../constants/MealStore';
import { Routes } from '../../constants/Routes';

// Reusable Progress Bar using your preferred heights and colors
const HorizontalBar = ({ progress, color }: { progress: number; color: string }) => (
  <View style={styles.barBg}>
    <View style={[styles.barFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: color }]} />
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>(MealStore.getMeals());
  const [goals, setGoals] = useState<UserGoals>(GoalStore.getGoals());
  const [water, setWater] = useState<number>(0);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const unsubMeals = MealStore.subscribe(() => setMeals(MealStore.getMeals()));
    const unsubGoals = GoalStore.subscribe(() => setGoals(GoalStore.getGoals()));
    return () => {
      unsubMeals();
      unsubGoals();
    };
  }, []);

  // --- Calculations ---
  const totalCals    = meals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const totalProtein = meals.reduce((s, m) => s + (m.protein  ?? 0), 0);
  const totalFats    = meals.reduce((s, m) => s + (m.fat      ?? 0), 0);
  const totalCarbs   = meals.reduce((s, m) => s + (m.carbs    ?? 0), 0);

  const waterPercentage = Math.round((water / goals.waterGoal) * 100);
  const addWater    = () => setWater((p) => Math.min(+(p + 0.1).toFixed(1), goals.waterGoal));
  const removeWater = () => setWater((p) => Math.max(+(p - 0.1).toFixed(1), 0));

  // --- UNIVERSAL DELETE LOGIC (Fixes Web & Mobile) ---
  const handleDeleteMeal = (meal: Meal) => {
    const performDelete = async () => {
      await MealStore.removeMeal(meal.id);
      const freshMeals = MealStore.getMeals();
      setMeals(freshMeals);
      if (freshMeals.length === 0) setEditMode(false);
    };

    // Intuitive Confirmation Logic
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${meal.type}"? This cannot be undone.`)) {
        performDelete();
      }
    } else {
      Alert.alert(
        "Delete Meal",
        `Are you sure you want to remove "${meal.type}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: performDelete }
        ]
      );
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* --- Header Section --- */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.profileSquare}>
              {/* Changed to -outline icons to stop "Tofu" rectangles on Web */}
              <Ionicons name="person-outline" size={32} color="#00E5FF" />
            </View>
            <View>
              <Text style={styles.greetingText}>Hello {goals.name}!</Text>
              <Text style={styles.subGreeting}>Let's track your health</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.calendarCircle} onPress={() => router.push(Routes.TRACKER as any)}>
            <Ionicons name="stats-chart-outline" size={24} color="#00E5FF" />
          </TouchableOpacity>
        </View>

        {/* --- Nutrients Tracker Card --- */}
        <Text style={styles.sectionTitle}>Nutrients Tracker</Text>
        <TouchableOpacity style={styles.card} onPress={() => router.push(Routes.TRACKER as any)}>
          <View style={styles.macroRow}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(totalProtein)}/{goals.proteinGoal}g</Text>
              <HorizontalBar progress={totalProtein / goals.proteinGoal} color="#00E5FF" />
              <Text style={styles.macroLabel}>Proteins</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(totalFats)}/{goals.fatGoal}g</Text>
              <HorizontalBar progress={totalFats / goals.fatGoal} color="#00E676" />
              <Text style={styles.macroLabel}>Fats</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{Math.round(totalCarbs)}/{goals.carbGoal}g</Text>
              <HorizontalBar progress={totalCarbs / goals.carbGoal} color="#FFD600" />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
          </View>
          <View style={styles.calorieSection}>
            <Text style={styles.calValueText}>
              {totalCals} <Text style={styles.calGoalText}>/ {goals.calorieGoal} Cal</Text>
            </Text>
            <HorizontalBar progress={totalCals / goals.calorieGoal} color="#00E676" />
          </View>
        </TouchableOpacity>

        {/* --- Water Section --- */}
        <Text style={styles.sectionTitle}>Daily Water Intake</Text>
        <View style={styles.card}>
          <View style={styles.waterRow}>
            <View style={styles.waterInfo}>
              <Text style={styles.waterLabelText}>Consumed</Text>
              <Text style={styles.waterMainVal}>{water.toFixed(1)}<Text style={styles.waterSubVal}> / {goals.waterGoal}L</Text></Text>
              <Text style={styles.hydrationStatus}>Hydration: {waterPercentage}%</Text>
            </View>
            <View style={styles.waterVisuals}>
              <View style={styles.waterButtons}>
                {/* Large touch targets for accessibility */}
                <TouchableOpacity style={styles.accCircleBtn} onPress={addWater} hitSlop={15}>
                  <Ionicons name="add-outline" size={30} color="#00E5FF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.accCircleBtn} onPress={removeWater} hitSlop={15}>
                  <Ionicons name="remove-outline" size={30} color="#00E5FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.waterPillBg}>
                <View style={[styles.waterPillFill, { height: `${waterPercentage}%` }]} />
                <Text style={styles.waterPercentText}>{waterPercentage}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* --- Meals List Section --- */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Meals</Text>
          <View style={styles.mealHeaderActions}>
            {meals.length > 0 && (
              <TouchableOpacity
                style={[styles.editBtn, editMode && styles.editBtnActive]}
                onPress={() => setEditMode(!editMode)}
              >
                <Ionicons 
                  name={editMode ? 'checkmark-outline' : 'pencil-outline'} 
                  size={18} 
                  color={editMode ? '#0D1117' : '#8B949E'} 
                />
                <Text style={[styles.editBtnText, editMode && styles.editBtnTextActive]}>
                  {editMode ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.addMealBtn} onPress={() => router.push('/meal-details' as any)}>
              <Ionicons name="add-outline" size={35} color="#0D1117" />
            </TouchableOpacity>
          </View>
        </View>

        {meals.length === 0 ? (
          <View style={styles.emptyMeals}>
            <Ionicons name="fast-food-outline" size={40} color="#30363D" />
            <Text style={styles.emptyMealsText}>No meals logged yet</Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              {editMode && (
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteMeal(meal)}>
                  <Ionicons name="trash-outline" size={20} color="#FF453A" />
                </TouchableOpacity>
              )}
              <View style={styles.mealLeft}>
                <View style={styles.mealIconBox}>
                  <Ionicons name="restaurant-outline" size={22} color="#00E5FF" />
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
            </View>
          ))
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
  mealHeaderActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#161B22', borderWidth: 1, borderColor: '#30363D' },
  editBtnActive: { backgroundColor: '#00E676', borderColor: '#00E676' },
  editBtnText: { fontSize: 14, fontWeight: '600', color: '#8B949E' },
  editBtnTextActive: { color: '#0D1117' },
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
  deleteBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2D1B1B', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#FF453A33' },
  mealLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  mealIconBox: { width: 48, height: 48, backgroundColor: '#0D1117', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mealName: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  mealTime: { fontSize: 14, color: '#8B949E', marginTop: 2 },
  mealRight: { alignItems: 'flex-end' },
  mealCalValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  mealCalLabel: { fontSize: 12, color: '#8B949E', fontWeight: 'bold' },
  emptyMeals: { alignItems: 'center', paddingVertical: 40 },
  emptyMealsText: { color: '#C9D1D9', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
});