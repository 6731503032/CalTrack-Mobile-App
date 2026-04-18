import { addDoc, collection, getDocs, query, where } from '@firebase/firestore';
import { db } from './firebase';

export type CalorieEntry = {
    userId: string;
    foodId: string;
    foodName: string;
    cal: number;
    pro: number;
    fat: number;
    carb: number;
    quantity: number;   // e.g. 1.5 servings
    date: string;       // "2026-04-18"
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
};

// Add a food log entry
export async function logCalorie(entry: CalorieEntry) {
    await addDoc(collection(db, 'calorie_logs'), {
        ...entry,
        createdAt: new Date(),
    });
}

// Get today's logs for a user
export async function getTodayLogs(userId: string) {
    const today = new Date().toISOString().split('T')[0]; // "2026-04-18"
    const q = query(
        collection(db, 'calorie_logs'),
        where('userId', '==', userId),
        where('date', '==', today)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}