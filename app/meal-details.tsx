import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface FoodItem {
  id: string;
  name: string;
  weight: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

export default function MealDetailsScreen() {
  const router = useRouter();

  // State to manage the food list
  const [foods, setFoods] = useState<FoodItem[]>([
    { id: '1', name: 'Fried eggs', weight: 100, calories: 200, proteins: 19.6, fats: 21.5, carbs: 10.6 },
    { id: '2', name: 'Milk', weight: 200, calories: 84, proteins: 5.0, fats: 4.0, carbs: 6.0 },
  ]);

  // Calculations for the top summary
  const totals = {
    cal: foods.reduce((s, f) => s + f.calories, 0),
    prot: foods.reduce((s, f) => s + f.proteins, 0),
    fat: foods.reduce((s, f) => s + f.fats, 0),
    carb: foods.reduce((s, f) => s + f.carbs, 0),
  };

  const addItem = () => {
    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: 'New Food Item',
      weight: 100,
      calories: 100,
      proteins: 5,
      fats: 2,
      carbs: 10,
    };
    setFoods([...foods, newItem]);
  };

  const removeItem = (id: string) => {
    setFoods(foods.filter(f => f.id !== id));
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header Row */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-outline" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breakfast</Text>
        <TouchableOpacity onPress={addItem}>
          <Ionicons name="add-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Macro Summary Row */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{totals.cal}</Text>
          <Text style={styles.summaryLab}>Calories</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{totals.prot.toFixed(1)}g</Text>
          <Text style={styles.summaryLab}>Proteins</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{totals.fat.toFixed(1)}g</Text>
          <Text style={styles.summaryLab}>Fats</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{totals.carb.toFixed(1)}g</Text>
          <Text style={styles.summaryLab}>Carbs</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Food Item List */}
      <ScrollView style={styles.list}>
        {foods.map((item) => (
          <View key={item.id} style={styles.foodRow}>
            <View>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodSub}>{item.weight} g • {item.calories} Cal</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="ellipsis-vertical" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Central Add Button */}
        <TouchableOpacity style={styles.centerAdd} onPress={addItem}>
          <Ionicons name="add" size={48} color="#000" />
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 },
  summaryItem: { alignItems: 'center' },
  summaryVal: { fontSize: 16, fontWeight: 'bold' },
  summaryLab: { fontSize: 12, color: '#666' },
  divider: { height: 1, backgroundColor: '#EEE' },
  list: { flex: 1, paddingHorizontal: 20 },
  foodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  foodName: { fontSize: 15, fontWeight: '600' },
  foodSub: { fontSize: 13, color: '#999', marginTop: 2 },
  centerAdd: { alignSelf: 'center', marginTop: 40 },
  footer: { padding: 20, paddingBottom: 30 },
  saveBtn: { backgroundColor: '#2ECC71', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});