import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDSgAbBEnv6FxFD5Ypv3lssZu1w7-KRm1Y",
    authDomain: "caltrack-72fa8.firebaseapp.com",
    projectId: "caltrack-72fa8",
    storageBucket: "caltrack-72fa8.firebasestorage.app",
    messagingSenderId: "817061065777",
    appId: "1:817061065777:web:eee788a127f44deaad9110",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FOODS = [
  { id:'1',  name:'Chicken Breast',   calories:165, protein:31,  fat:3.6, carbs:0,    unit:'100g',      category:'Protein', description:'Lean white meat, high protein, low fat' },
  { id:'2',  name:'Salmon',           calories:208, protein:20,  fat:13,  carbs:0,    unit:'100g',      category:'Protein', description:'Rich in omega-3 fatty acids' },
  { id:'3',  name:'Egg (Large)',       calories:78,  protein:6,   fat:5,   carbs:0.6,  unit:'1 pc',      category:'Protein', description:'Complete protein with essential amino acids' },
  { id:'7',  name:'Jasmine Rice',      calories:130, protein:2.7, fat:0.3, carbs:28,   unit:'100g',      category:'Carbs',   description:'Fragrant Thai staple, quick energy' },
  { id:'8',  name:'Sweet Potato',      calories:86,  protein:1.6, fat:0.1, carbs:20,   unit:'100g',      category:'Carbs',   description:'Complex carbohydrate, high in Vitamin A' },
  { id:'10', name:'Red Apple',         calories:52,  protein:0.3, fat:0.2, carbs:14,   unit:'100g',      category:'Fruits',  description:'Crispy and sweet, great for fiber' },
  { id:'11', name:'Banana',            calories:89,  protein:1.1, fat:0.3, carbs:23,   unit:'100g',      category:'Fruits',  description:'High in potassium and quick energy' },
  { id:'12', name:'Avocado',           calories:160, protein:2,   fat:15,  carbs:9,    unit:'100g',      category:'Fruits',  description:'Heart-healthy fats and very creamy' },
  { id:'13', name:'Strawberries',      calories:32,  protein:0.7, fat:0.3, carbs:7.7,  unit:'100g',      category:'Fruits',  description:'Low calorie, high Vitamin C' },
  { id:'15', name:'Broccoli',          calories:34,  protein:2.8, fat:0.4, carbs:7,    unit:'100g',      category:'Veggies', description:'Nutrient-dense cruciferous vegetable' },
  { id:'16', name:'Spinach',           calories:23,  protein:2.9, fat:0.4, carbs:3.6,  unit:'100g',      category:'Veggies', description:'Leafy green, very high in iron' },
  { id:'17', name:'Carrots',           calories:41,  protein:0.9, fat:0.2, carbs:10,   unit:'100g',      category:'Veggies', description:'Crunchy, sweet, and good for eyes' },
  { id:'18', name:'Bell Pepper',       calories:31,  protein:1,   fat:0.3, carbs:6,    unit:'100g',      category:'Veggies', description:'Sweet and colorful, high in antioxidants' },
  { id:'21', name:'Pad Krapow Moo',    calories:320, protein:22,  fat:18,  carbs:14,   unit:'1 serving', category:'Thai',    description:'Stir-fried pork with holy basil and chili' },
  { id:'22', name:'Pad Thai',          calories:400, protein:18,  fat:14,  carbs:52,   unit:'1 serving', category:'Thai',    description:'Classic stir-fried noodles with sprouts and peanuts' },
  { id:'23', name:'Tom Yum Goong',     calories:180, protein:15,  fat:7,   carbs:12,   unit:'1 bowl',    category:'Thai',    description:'Spicy and sour shrimp soup with lemongrass' },
  { id:'24', name:'Green Curry',       calories:350, protein:20,  fat:22,  carbs:18,   unit:'1 serving', category:'Thai',    description:'Thai green curry with coconut milk and bamboo shoots' },
  { id:'25', name:'Som Tum',           calories:150, protein:4,   fat:3,   carbs:28,   unit:'1 serving', category:'Thai',    description:'Green papaya salad with peanuts and lime' },
  { id:'26', name:'Khao Man Gai',      calories:450, protein:35,  fat:12,  carbs:48,   unit:'1 serving', category:'Thai',    description:'Poached chicken over seasoned rice with dipping sauce' },
  { id:'27', name:'Massaman Curry',    calories:380, protein:18,  fat:24,  carbs:22,   unit:'1 serving', category:'Thai',    description:'Rich, mild curry with potatoes, peanuts, and meat' },
  { id:'28', name:'Mango Sticky Rice', calories:360, protein:4,   fat:8,   carbs:68,   unit:'1 serving', category:'Thai',    description:'Sweet mango slices with coconut-infused glutinous rice' },
  { id:'29', name:'Pad See Ew',        calories:380, protein:20,  fat:12,  carbs:50,   unit:'1 serving', category:'Thai',    description:'Stir-fried wide rice noodles with dark soy sauce and kale' },
  { id:'30', name:'Tom Kha Gai',       calories:220, protein:16,  fat:14,  carbs:8,    unit:'1 bowl',    category:'Thai',    description:'Creamy coconut chicken soup with galangal and mushrooms' },
];

const existing = await getDocs(collection(db, 'foods'));
if (!existing.empty) {
    console.log('⚠️ Already seeded!');
    process.exit(0);
}

for (const food of FOODS) {
    const { id, ...data } = food;
    await setDoc(doc(db, 'foods', id), data);
    console.log(`✅ Added: ${food.name}`);
}

console.log('🎉 All foods uploaded to Firestore!');
process.exit(0);