// constants/MealStore.ts
import storage from './storage';

export interface Meal {
  id: string;
  type: string;
  calories: number;
  time: string;
  date: string;
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

let meals: Meal[] = [];
let mealListeners: Function[] = [];
let pendingItems: PendingFoodItem[] = [];
let pendingListeners: Function[] = [];

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

async function persist(): Promise<void> {
  try {
    await storage.setItem(STORAGE_KEY, JSON.stringify(meals));
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
  async hydrate(): Promise<void> {
    try {
      const raw = await storage.getItem(STORAGE_KEY);
      if (raw) {
        meals = JSON.parse(raw) as Meal[];
        notifyMeals();
      }
    } catch (e) {
      console.warn('MealStore: failed to hydrate', e);
    }
  },

  getMeals(): Meal[] {
    return meals;
  },

  getTodaysMeals(): Meal[] {
    const today = todayStr();
    return meals.filter((m) => m.date === today);
  },

  async addMeal(meal: Meal): Promise<void> {
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