import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import * as Font from 'expo-font';
import { Meal, MealStore } from '../../constants/MealStore';
import { Routes } from '../../constants/Routes';

export default function TrackerScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>(MealStore.getMeals());
  const [loaded, setLoaded] = useState(false);

  const weeklyData = [
    { day: 'M', value: 0.6, label: '2.1k' },
    { day: 'T', value: 0.8, label: '2.8k' },
    { day: 'W', value: 0.4, label: '1.5k' },
    { day: 'T', value: 0.9, label: '3.1k' },
    { day: 'F', value: 0.7, label: '2.4k' },
    { day: 'S', value: 0.5, label: '1.9k' },
    { day: 'S', value: 0.3, label: '1.1k' },
  ];

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

    const unsubscribe = MealStore.subscribe(() => {
      setMeals(MealStore.getMeals());
    });
    return unsubscribe;
  }, []);

  const handleAddMeal = () => {
    router.push({ pathname: '/meal-details', params: { type: 'New Entry' } } as any);
  };

  if (!loaded) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#00E5FF" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Detailed Analysis</Text>

        {/* Upper Box: Weekly Calorie Graph */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weekly Progress</Text>
            <Text style={styles.cardSub}>Avg: 2,400 Cal</Text>
          </View>
          
          <View style={styles.graphContainer}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.barWrapper}>
                <View style={[styles.barFill, { height: item.value * 100 }]} />
                <Text style={styles.barDay}>{item.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Lower Box: Meal Log / Add Food */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Meals</Text>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddMeal}>
              <Ionicons name="add-circle" size={24} color="#00E676" />
            </TouchableOpacity>
          </View>

          {meals.map((meal, index) => (
            <TouchableOpacity 
              key={meal.id} 
              style={[styles.mealRow, index === meals.length - 1 && { borderBottomWidth: 0 }]} 
              onPress={() => router.push({ pathname: '/meal-details', params: { type: meal.type } } as any)}
            >
              <View style={styles.mealIconBox}>
                <Ionicons name="restaurant" size={20} color="#00E5FF" />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.type}</Text>
                <Text style={styles.mealDetails}>{meal.time} â¢ {meal.calories} Calories</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#30363D" />
            </TouchableOpacity>
          ))}
          {meals.length === 0 && (
             <View style={styles.emptyContainer}>
                <Ionicons name="sad-outline" size={40} color="#8B949E" />
                <Text style={styles.emptyText}>No meals added today.</Text>
             </View>
          )}
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={styles.smallStatCard}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={[styles.statValue, { color: '#FFD600' }]}>12 Days</Text>
          </View>
          <View style={styles.smallStatCard}>
            <Text style={styles.statLabel}>Water</Text>
            <Text style={[styles.statValue, { color: '#00E5FF' }]}>1.8L</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },
  container: { padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 25,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#161B22',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  cardSub: { fontSize: 14, color: '#8B949E' },
  
  // Graph Styles
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  barWrapper: { alignItems: 'center', width: '10%' },
  barFill: {
    width: 8,
    backgroundColor: '#00E676', // Your Lime Green
    borderRadius: 4,
    minHeight: 5,
  },
  barDay: { color: '#C9D1D9', fontSize: 12, marginTop: 8, fontWeight: '600' },

  // Meal List Styles
  addBtn: { padding: 4 },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  mealIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  mealInfo: { flex: 1 },
  mealName: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  mealDetails: { color: '#8B949E', fontSize: 13, marginTop: 2 },

  // Bottom Stats
  statsRow: { flexDirection: 'row', gap: 15 },
  smallStatCard: {
    flex: 1,
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  statLabel: { color: '#8B949E', fontSize: 12, textTransform: 'uppercase', fontWeight: 'bold' },
  statValue: { fontSize: 18, fontWeight: '900', marginTop: 5 },

  // Empty State
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  emptyText: { color: '#C9D1D9', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
});