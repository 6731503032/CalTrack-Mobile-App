import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Meal, MealStore, PendingFoodItem } from '../constants/MealStore';

export default function MealDetailsScreen() {
  const router = useRouter();

  // Foods are read from the pending basket in MealStore
  const [foods, setFoods] = useState<PendingFoodItem[]>(MealStore.getPendingItems());

  // Meal name modal state
  const [nameModalVisible, setNameModalVisible] = useState<boolean>(false);
  const [mealName, setMealName] = useState<string>('');
  const [mealNameInput, setMealNameInput] = useState<string>('');

  const MEAL_PRESETS = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'];

  // Subscribe to pending basket changes (food-picker writes here)
  useEffect(() => {
    // Clear basket when screen first mounts so previous session doesn't bleed in
    MealStore.clearPending();
    setFoods([]);

    const unsub = MealStore.subscribePending(() => {
      setFoods(MealStore.getPendingItems());
    });
    return unsub;
  }, []);

  // --- Totals ---
  const totals = {
    cal:  Math.round(foods.reduce((s, f) => s + f.calories, 0)),
    prot: foods.reduce((s, f) => s + f.proteins, 0),
    fat:  foods.reduce((s, f) => s + f.fats, 0),
    carb: foods.reduce((s, f) => s + f.carbs, 0),
  };

  // --- Actions ---
  const handleAddFood = () => {
    router.push('/food-picker' as any);
  };

  const handleRemoveItem = (item: PendingFoodItem) => {
    Alert.alert(item.name, 'Remove this item from your meal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => MealStore.removePendingItem(item.id),
      },
    ]);
  };

  const handleSave = () => {
    if (foods.length === 0) {
      Alert.alert('No items', 'Add at least one food item before saving.');
      return;
    }
    if (!mealName.trim()) {
      // Open name picker first
      setMealNameInput('');
      setNameModalVisible(true);
      return;
    }
    commitSave(mealName.trim());
  };

  const commitSave = (name: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const meal: Meal = {
      id: Date.now().toString(),
      type: name,
      calories: totals.cal,
      time: timeStr,
      date: new Date().toISOString().split('T')[0],  // ← add this line
      protein: Math.round(totals.prot * 10) / 10,
      fat:     Math.round(totals.fat  * 10) / 10,
      carbs:   Math.round(totals.carb * 10) / 10,
    };

    MealStore.addMeal(meal);
    MealStore.clearPending();
    router.back();
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            MealStore.clearPending();
            router.back();
          }}
        >
          <Ionicons name="close-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Meal name — tap to rename */}
        <TouchableOpacity onPress={() => { setMealNameInput(mealName); setNameModalVisible(true); }}>
          <Text style={styles.headerTitle}>
            {mealName.trim() ? mealName : 'Tap to name meal'}
          </Text>
          <Text style={styles.headerSubtitle}>tap to set name</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={handleAddFood}>
          <Ionicons name="add-outline" size={28} color="#00E676" />
        </TouchableOpacity>
      </View>

      {/* --- Macro Summary --- */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{totals.cal}</Text>
          <Text style={styles.summaryLab}>Calories</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: '#00E5FF' }]}>{totals.prot.toFixed(1)}g</Text>
          <Text style={styles.summaryLab}>Protein</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: '#00E676' }]}>{totals.fat.toFixed(1)}g</Text>
          <Text style={styles.summaryLab}>Fats</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: '#FFD600' }]}>{totals.carb.toFixed(1)}g</Text>
          <Text style={styles.summaryLab}>Carbs</Text>
        </View>
      </View>

      {/* --- Food List --- */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {foods.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="restaurant-outline" size={48} color="#30363D" />
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubText}>Tap + to add food from the database</Text>
          </View>
        )}

        {foods.map((item) => (
          <View key={item.id} style={styles.foodRow}>
            <View style={styles.foodIconBox}>
              <Ionicons name="fast-food-outline" size={20} color="#00E5FF" />
            </View>
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodSub}>
                {item.weight}g • {item.calories} Cal • P:{item.proteins}g F:{item.fats}g C:{item.carbs}g
              </Text>
            </View>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveItem(item)}>
              <Ionicons name="trash-outline" size={18} color="#8B949E" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.centerAdd} onPress={handleAddFood}>
          <Ionicons name="add-circle" size={52} color="#00E676" />
          <Text style={styles.centerAddText}>Add More Food</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Save Footer --- */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, foods.length === 0 && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={foods.length === 0}
        >
          <Text style={styles.saveBtnText}>Save Meal</Text>
        </TouchableOpacity>
      </View>

      {/* --- Meal Name Modal --- */}
      <Modal
        visible={nameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Name this meal</Text>

            {/* Preset chips */}
            <View style={styles.presetRow}>
              {MEAL_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[styles.presetChip, mealNameInput === preset && styles.presetChipActive]}
                  onPress={() => setMealNameInput(preset)}
                >
                  <Text style={[styles.presetText, mealNameInput === preset && styles.presetTextActive]}>
                    {preset}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom name input */}
            <TextInput
              style={styles.nameInput}
              placeholder="Or type a custom name..."
              placeholderTextColor="#8B949E"
              value={mealNameInput}
              onChangeText={setMealNameInput}
              maxLength={30}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setNameModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, !mealNameInput.trim() && styles.modalConfirmDisabled]}
                disabled={!mealNameInput.trim()}
                onPress={() => {
                  const name = mealNameInput.trim();
                  setMealName(name);
                  setNameModalVisible(false);
                  // If save was triggered, commit immediately
                  if (foods.length > 0) {
                    commitSave(name);
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0D1117' },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  headerSubtitle: { fontSize: 11, color: '#8B949E', textAlign: 'center', marginTop: 2 },
  iconBtn: { width: 40, height: 40, backgroundColor: '#161B22', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#30363D' },

  // Summary
  summaryCard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#161B22', marginHorizontal: 20, borderRadius: 18, paddingVertical: 20, borderWidth: 1.5, borderColor: '#30363D', marginBottom: 20 },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryVal: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  summaryLab: { fontSize: 12, color: '#8B949E', marginTop: 4, fontWeight: '600' },
  summaryDivider: { width: 1, height: 36, backgroundColor: '#30363D' },

  // List
  list: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyState: { alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  emptyText: { color: '#C9D1D9', fontSize: 16, fontWeight: 'bold', marginTop: 16 },
  emptySubText: { color: '#8B949E', fontSize: 13, marginTop: 6 },

  // Food row
  foodRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161B22', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#30363D' },
  foodIconBox: { width: 40, height: 40, backgroundColor: '#0D1117', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  foodSub: { fontSize: 12, color: '#8B949E', marginTop: 3 },
  removeBtn: { padding: 6 },
  centerAdd: { alignItems: 'center', paddingVertical: 30 },
  centerAddText: { color: '#00E676', fontSize: 14, fontWeight: '700', marginTop: 8 },

  // Footer
  footer: { padding: 20, paddingBottom: 30, backgroundColor: '#0D1117' },
  saveBtn: { backgroundColor: '#00E676', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: '#21262D' },
  saveBtnText: { color: '#0D1117', fontSize: 16, fontWeight: '900' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  modalBox: { backgroundColor: '#161B22', borderRadius: 20, padding: 24, width: '100%', borderWidth: 1.5, borderColor: '#30363D' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 16, textAlign: 'center' },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  presetChip: { paddingVertical: 7, paddingHorizontal: 14, backgroundColor: '#0D1117', borderRadius: 20, borderWidth: 1, borderColor: '#30363D' },
  presetChipActive: { backgroundColor: '#00E676', borderColor: '#00E676' },
  presetText: { color: '#C9D1D9', fontWeight: '600', fontSize: 13 },
  presetTextActive: { color: '#0D1117' },
  nameInput: { backgroundColor: '#0D1117', borderRadius: 12, borderWidth: 1, borderColor: '#30363D', color: '#FFFFFF', paddingHorizontal: 16, height: 48, fontSize: 15, marginBottom: 20 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#21262D' },
  modalCancelText: { color: '#8B949E', fontWeight: '700' },
  modalConfirm: { flex: 1, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00E676' },
  modalConfirmDisabled: { backgroundColor: '#21262D' },
  modalConfirmText: { color: '#0D1117', fontWeight: '900' },
});