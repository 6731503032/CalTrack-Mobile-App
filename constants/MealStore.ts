// Ensure the Interface is exported
export interface Meal {
  id: string;
  type: string;
  calories: number;
  time: string;
}

let meals: Meal[] = [
  { id: '1', type: 'Breakfast', calories: 531, time: '10:45 AM' },
  { id: '2', type: 'Lunch', calories: 1024, time: '03:45 PM' },
];

let listeners: Function[] = [];

// This is a NAMED EXPORT
export const MealStore = {
  getMeals: () => meals,
  addMeal: (meal: Meal) => {
    meals = [...meals, meal];
    listeners.forEach(l => l());
  },
  subscribe: (listener: Function) => {
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }
};