import { collection, doc, getDocs, setDoc } from '@firebase/firestore';
import { FOOD_DATABASE } from 'constants/FoodDatabase';
import { db } from './firebase';

export async function seedFoodDatabase() {
    try {
        const existing = await getDocs(collection(db, 'foods'));
        if (!existing.empty) {
            console.log('⚠️ Already seeded, skipping.');
            return;
        }

        for (const food of FOOD_DATABASE) {
            await setDoc(doc(db, 'foods', food.id), {
                name: food.name,
                cal: food.cal,
                pro: food.pro,
                fat: food.fat,
                carb: food.carb,
                unit: food.unit,
                cat: food.cat,
                img: food.img,
                description: food.description ?? '',
            });
        }
        console.log('✅ Foods uploaded to Firestore!');
    } catch (e) {
        console.error('❌ Seed failed:', e);
    }
}