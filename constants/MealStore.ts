// constants/MealStore.ts
// Meals are persisted to AsyncStorage so they survive app restarts.
// Install if needed: npx expo install @react-native-async-storage/async-storage

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Meal {
  id: string;
  type: string;
  calories: number;
  time: string;
  date: string;   // ISO date string "2024-03-01" — enables daily filtering
  protein?: number;
  fat?: number;
  carbs?: number;
}

export interface PendingFoodItem {
  id: string;
  name: string;
  weight: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
}

const STORAGE_KEY = 'caltrack_meals';

// --- In-memory state ---
let meals: Meal[] = [];
let mealListeners: Function[] = [];
let pendingItems: PendingFoodItem[] = [];
let pendingListeners: Function[] = [];

// --- Helpers ---
function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

async function persist(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  } catch (e) {
    console.warn('MealStore: failed to persist', e);
  }
}

function notifyMeals(): void {
  mealListeners.forEach((l) => l());
}

function notifyPending(): void {
  pendingListeners.forEach((l) => l());
}

export const MealStore = {
  // ── Hydrate from storage (call once on app start) ─────────────────────────
  async hydrate(): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        meals = JSON.parse(raw) as Meal[];
        notifyMeals();
      }
    } catch (e) {
      console.warn('MealStore: failed to hydrate', e);
    }
  },

  // ── Saved meals ───────────────────────────────────────────────────────────
  getMeals(): Meal[] {
    return meals;
  },

  getTodaysMeals(): Meal[] {
    const today = todayStr();
    return meals.filter((m) => m.date === today);
  },

  async addMeal(meal: Meal): Promise<void> {
    // Attach today's date if not provided
    if (!meal.date) meal.date = todayStr();
    meals = [...meals, meal];
    notifyMeals();
    await persist();
  },

  async removeMeal(id: string): Promise<void> {
    meals = meals.filter((m) => m.id !== id);
    notifyMeals();
    await persist();
  },

  subscribe(listener: Function): () => void {
    mealListeners.push(listener);
    return () => {
      mealListeners = mealListeners.filter((l) => l !== listener);
    };
  },

  // ── Pending basket ────────────────────────────────────────────────────────
  getPendingItems(): PendingFoodItem[] {
    return pendingItems;
  },

  addPendingItem(item: PendingFoodItem): void {
    const exists = pendingItems.some((p) => p.id === item.id);
    if (!exists) {
      pendingItems = [...pendingItems, item];
      notifyPending();
    }
  },

  removePendingItem(id: string): void {
    pendingItems = pendingItems.filter((p) => p.id !== id);
    notifyPending();
  },

  clearPending(): void {
    pendingItems = [];
    notifyPending();
  },

  subscribePending(listener: Function): () => void {
    pendingListeners.push(listener);
    return () => {
      pendingListeners = pendingListeners.filter((l) => l !== listener);
    };
  },
};