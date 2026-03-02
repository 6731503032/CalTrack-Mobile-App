import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GoalStore, UserGoals } from '../../constants/GoalStore';
import { Meal, MealStore } from '../../constants/MealStore';

function getWeekDays(): { dateStr: string; label: string; isToday: boolean }[] {
  const days = [];
  const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      dateStr,
      label: labels[i],
      isToday: dateStr === today.toISOString().split('T')[0],
    });
  }
  return days;
}

export default function TrackerScreen() {
  const router = useRouter();
  const [allMeals, setAllMeals] = useState<Meal[]>(MealStore.getMeals());
  const [goals, setGoals] = useState<UserGoals>(GoalStore.getGoals());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const weekDays = getWeekDays();

  useEffect(() => {
    const unsubMeals = MealStore.subscribe(() => setAllMeals(MealStore.getMeals()));
    const unsubGoals = GoalStore.subscribe(() => setGoals(GoalStore.getGoals()));
    return () => {
      unsubMeals();
      unsubGoals();
    };
  }, []);

  const caloriesByDay: Record<string, number> = {};
  weekDays.forEach(({ dateStr }) => {
    caloriesByDay[dateStr] = allMeals
      .filter((m) => m.date === dateStr)
      .reduce((s, m) => s + (m.calories ?? 0), 0);
  });

  const maxCals = Math.max(...Object.values(caloriesByDay), 1);

  const selectedMeals = allMeals.filter((m) => m.date === selectedDate);
  const selectedCals = selectedMeals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const selectedProtein = selectedMeals.reduce((s, m) => s + (m.protein ?? 0), 0);
  const selectedFats = selectedMeals.reduce((s, m) => s + (m.fat ?? 0), 0);
  const selectedCarbs = selectedMeals.reduce((s, m) => s + (m.carbs ?? 0), 0);

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hasMeals = allMeals.some((m) => m.date === dateStr);
      if (hasMeals) count++;
      else break;
    }
    return count;
  })();

  const weeklyTotal = Object.values(caloriesByDay).reduce((s, v) => s + v, 0);
  const daysWithData = Object.values(caloriesByDay).filter((v) => v > 0).length;
  const weeklyAvg = daysWithData > 0 ? Math.round(weeklyTotal / daysWithData) : 0;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const handleAddMeal = () => {
    router.push({ pathname: '/meal-details', params: { type: 'New Entry' } } as any);
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detailed Analysis</Text>

        {/* --- Weekly Chart --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Progress</Text>
            <Text style={styles.cardSub}>
              Avg: {weeklyAvg > 0 ? `${weeklyAvg.toLocaleString()} Cal` : '—'}
            </Text>
          </View>

          <View style={styles.graphContainer}>
            {weekDays.map(({ dateStr, label, isToday }) => {
              const cals = caloriesByDay[dateStr] ?? 0;
              const barHeight = cals > 0 ? Math.max((cals / maxCals) * 100, 8) : 6;
              const isSelected = dateStr === selectedDate;

              return (
                <TouchableOpacity
                  key={dateStr}
                  style={styles.barWrapper}
                  onPress={() => setSelectedDate(dateStr)}
                  activeOpacity={0.7}
                >
                  {isSelected && <View style={styles.selectedIndicator} />}
                  <View
                    style={[
                      styles.barFill,
                      { height: barHeight },
                      isSelected && styles.barSelected,
                      cals === 0 && styles.barEmpty,
                    ]}
                  />
                  <Text style={[
                    styles.barDay,
                    isToday && styles.barDayToday,
                    isSelected && styles.barDaySelected,
                  ]}>
                    {label}
                  </Text>
                  {cals > 0 && (
                    <Text style={styles.barCalLabel}>
                      {cals >= 1000 ? `${(cals / 1000).toFixed(1)}k` : cals}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Goal line indicator */}
          <View style={styles.goalRow}>
            <View style={styles.goalDot} />
            <Text style={styles.goalText}>Daily goal: {goals.calorieGoal.toLocaleString()} Cal</Text>
          </View>
        </View>

        {/* --- Selected Day Meals --- */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>
                {selectedDate === new Date().toISOString().split('T')[0]
                  ? "Today's Meals"
                  : formatDate(selectedDate)}
              </Text>
              {selectedCals > 0 && (
                <Text style={styles.cardSub}>
                  {selectedCals.toLocaleString()} / {goals.calorieGoal.toLocaleString()} Cal
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddMeal}>
              <Ionicons name="add-circle" size={28} color="#00E676" />
            </TouchableOpacity>
          </View>

          {selectedMeals.length > 0 && (
            <View style={styles.macroRow}>
              <View style={styles.macroChip}>
                <Text style={styles.macroChipVal}>{Math.round(selectedProtein)}g</Text>
                <Text style={styles.macroChipLabel}>Protein</Text>
                <Text style={styles.macroChipGoal}>/ {goals.proteinGoal}g</Text>
              </View>
              <View style={styles.macroChip}>
                <Text style={[styles.macroChipVal, { color: '#00E676' }]}>{Math.round(selectedFats)}g</Text>
                <Text style={styles.macroChipLabel}>Fats</Text>
                <Text style={styles.macroChipGoal}>/ {goals.fatGoal}g</Text>
              </View>
              <View style={styles.macroChip}>
                <Text style={[styles.macroChipVal, { color: '#FFD600' }]}>{Math.round(selectedCarbs)}g</Text>
                <Text style={styles.macroChipLabel}>Carbs</Text>
                <Text style={styles.macroChipGoal}>/ {goals.carbGoal}g</Text>
              </View>
            </View>
          )}

          {selectedMeals.map((meal, index) => (
            <TouchableOpacity
              key={meal.id}
              style={[styles.mealRow, index === selectedMeals.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => router.push({ pathname: '/meal-details', params: { type: meal.type } } as any)}
            >
              <View style={styles.mealIconBox}>
                <Ionicons name="restaurant" size={20} color="#00E5FF" />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.type}</Text>
                <Text style={styles.mealDetails}>{meal.time} · {meal.calories} Cal</Text>
              </View>
              <View style={styles.mealMacros}>
                <Text style={styles.mealMacroText}>P: {meal.protein ?? 0}g</Text>
                <Text style={styles.mealMacroText}>C: {meal.carbs ?? 0}g</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#30363D" />
            </TouchableOpacity>
          ))}

          {selectedMeals.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={40} color="#8B949E" />
              <Text style={styles.emptyText}>No meals logged</Text>
              <Text style={styles.emptySubText}>Tap + to add a meal</Text>
            </View>
          )}
        </View>

        {/* --- Stats Row --- */}
        <View style={styles.statsRow}>
          <View style={styles.smallStatCard}>
            <Ionicons name="flame" size={20} color="#FFD600" />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={[styles.statValue, { color: '#FFD600' }]}>
              {streak > 0 ? `${streak} Day${streak > 1 ? 's' : ''}` : '—'}
            </Text>
          </View>
          <View style={styles.smallStatCard}>
            <Ionicons name="calendar-outline" size={20} color="#00E5FF" />
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={[styles.statValue, { color: '#00E5FF' }]}>
              {weeklyTotal > 0 ? `${weeklyTotal.toLocaleString()} Cal` : '—'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  container: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginBottom: 25, letterSpacing: 0.5 },
  card: { backgroundColor: '#161B22', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#30363D' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  cardSub: { fontSize: 13, color: '#8B949E', marginTop: 2 },
  graphContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingTop: 10 },
  barWrapper: { alignItems: 'center', width: '12%', position: 'relative' },
  selectedIndicator: { position: 'absolute', top: -8, width: 6, height: 6, borderRadius: 3, backgroundColor: '#00E5FF' },
  barFill: { width: 10, backgroundColor: '#00E676', borderRadius: 5, minHeight: 6 },
  barSelected: { backgroundColor: '#00E5FF', width: 12 },
  barEmpty: { backgroundColor: '#21262D' },
  barDay: { color: '#8B949E', fontSize: 12, marginTop: 8, fontWeight: '600' },
  barDayToday: { color: '#C9D1D9' },
  barDaySelected: { color: '#00E5FF', fontWeight: '800' },
  barCalLabel: { color: '#8B949E', fontSize: 9, marginTop: 2 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  goalDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00E5FF' },
  goalText: { color: '#8B949E', fontSize: 12 },
  macroRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  macroChip: { flex: 1, backgroundColor: '#0D1117', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },
  macroChipVal: { fontSize: 16, fontWeight: '800', color: '#00E5FF' },
  macroChipLabel: { fontSize: 11, color: '#8B949E', marginTop: 2, fontWeight: '600' },
  macroChipGoal: { fontSize: 10, color: '#30363D', marginTop: 1 },
  addBtn: { padding: 4 },
  mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#30363D' },
  mealIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#0D1117', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  mealInfo: { flex: 1 },
  mealName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  mealDetails: { color: '#8B949E', fontSize: 13, marginTop: 2 },
  mealMacros: { alignItems: 'flex-end', marginRight: 10, gap: 2 },
  mealMacroText: { color: '#8B949E', fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 15 },
  smallStatCard: { flex: 1, backgroundColor: '#161B22', borderRadius: 16, padding: 15, borderWidth: 1, borderColor: '#30363D', gap: 4 },
  statLabel: { color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' },
  statValue: { fontSize: 18, fontWeight: '900' },
  emptyContainer: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: '#C9D1D9', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  emptySubText: { color: '#8B949E', fontSize: 13, marginTop: 4 },
});