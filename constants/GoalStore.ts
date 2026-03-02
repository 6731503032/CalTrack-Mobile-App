import storage from './storage';

export interface UserGoals {
  name: string;
  calorieGoal: number;
  waterGoal: number;
  proteinGoal: number;
  fatGoal: number;
  carbGoal: number;
}

const STORAGE_KEY = 'caltrack_goals';

// CLEAN SLATE
const DEFAULT_GOALS: UserGoals = {
  name: '', 
  calorieGoal: 2000,
  waterGoal: 2.0,
  proteinGoal: 150,
  fatGoal: 70,
  carbGoal: 250,
};

let goals: UserGoals = { ...DEFAULT_GOALS };
let listeners: Function[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const GoalStore = {
  async hydrate(): Promise<UserGoals> {
    try {
      const raw = await storage.getItem(STORAGE_KEY);
      // If we find data, use it; otherwise, stay empty
      goals = raw ? { ...DEFAULT_GOALS, ...JSON.parse(raw) } : { ...DEFAULT_GOALS };
      notify();
      return goals;
    } catch (e) {
      return goals;
    }
  },

  getGoals(): UserGoals {
    return goals;
  },

  async setGoals(updated: Partial<UserGoals>): Promise<void> {
    goals = { ...goals, ...updated };
    notify();
    await storage.setItem(STORAGE_KEY, JSON.stringify(goals));
  },

  subscribe(listener: Function): () => void {
    listeners.push(listener);
    return () => { listeners = listeners.filter((l) => l !== listener); };
  },
};