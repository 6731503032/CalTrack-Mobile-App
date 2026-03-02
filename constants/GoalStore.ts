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

const DEFAULT_GOALS: UserGoals = {
  name: 'Bon',
  calorieGoal: 3400,
  waterGoal: 2.5,
  proteinGoal: 225,
  fatGoal: 118,
  carbGoal: 340,
};

let goals: UserGoals = { ...DEFAULT_GOALS };
let listeners: Function[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export const GoalStore = {
  async hydrate(): Promise<void> {
    try {
      const raw = await storage.getItem(STORAGE_KEY);
      if (raw) goals = { ...DEFAULT_GOALS, ...JSON.parse(raw) };
      notify();
    } catch (e) {
      console.warn('GoalStore: failed to hydrate', e);
    }
  },

  getGoals(): UserGoals {
    return goals;
  },

  async setGoals(updated: Partial<UserGoals>): Promise<void> {
    goals = { ...goals, ...updated };
    notify();
    try {
      await storage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (e) {
      console.warn('GoalStore: failed to persist', e);
    }
  },

  subscribe(listener: Function): () => void {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};