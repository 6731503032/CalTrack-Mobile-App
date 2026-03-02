// constants/FoodDatabase.ts
// Single source of truth for all food items.
// Both food_database.tsx (browse) and food-picker.tsx (select) import from here.

export type FoodItem = {
    id: string;
    name: string;
    cal: number;
    pro: number;
    fat: number;
    carb: number;
    unit: string;
    cat: string;
    img: string;
    description?: string; // short flavour text shown in database browse mode
  };
  
  export const CATEGORIES = ['All', 'Protein', 'Carbs', 'Fats', 'Fruits', 'Veggies', 'Thai'] as const;
  export type Category = typeof CATEGORIES[number];
  
  // ---------------------------------------------------------------------------
  // Spoonacular CDN gives us real food photos reliably by dish name/id.
  // Format: https://spoonacular.com/cdn/ingredients_100x100/<name>.jpg  (ingredients)
  // For dishes we use their recipe image CDN or fallback to flaticon for basics.
  // ---------------------------------------------------------------------------
  
  export const FOOD_DATABASE: FoodItem[] = [
    // ── Proteins ──────────────────────────────────────────────────────────────
    {
      id: '1', name: 'Chicken Breast', cal: 165, pro: 31, fat: 3.6, carb: 0,
      unit: '100g', cat: 'Protein',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/chicken-breast.png',
      description: 'Lean white meat, high protein, low fat',
    },
    {
      id: '2', name: 'Salmon', cal: 208, pro: 20, fat: 13, carb: 0,
      unit: '100g', cat: 'Protein',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/salmon.png',
      description: 'Rich in omega-3 fatty acids',
    },
    {
      id: '3', name: 'Egg (Large)', cal: 78, pro: 6, fat: 5, carb: 0.6,
      unit: '1 pc', cat: 'Protein',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/egg.png',
      description: 'Complete protein with essential amino acids',
    },
    {
      id: '4', name: 'Tuna (Canned)', cal: 116, pro: 26, fat: 1, carb: 0,
      unit: '100g', cat: 'Protein',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/canned-tuna.png',
      description: 'High protein, very low fat',
    },
    {
      id: '5', name: 'Shrimp', cal: 99, pro: 24, fat: 0.3, carb: 0.2,
      unit: '100g', cat: 'Protein',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/shrimp.png',
      description: 'Low calorie, high protein seafood',
    },
  
    // ── Carbs ─────────────────────────────────────────────────────────────────
    {
      id: '6', name: 'Brown Rice', cal: 111, pro: 2.6, fat: 0.9, carb: 23,
      unit: '100g', cat: 'Carbs',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/brown-rice.png',
      description: 'Whole grain, high fiber complex carb',
    },
    {
      id: '7', name: 'Jasmine Rice', cal: 130, pro: 2.7, fat: 0.3, carb: 28,
      unit: '100g', cat: 'Carbs',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/white-rice.png',
      description: 'Fragrant Thai staple, quick energy',
    },
    {
      id: '8', name: 'Oats', cal: 389, pro: 16.9, fat: 6.9, carb: 66,
      unit: '100g', cat: 'Carbs',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/rolled-oats.png',
      description: 'High fiber, slow-digesting energy',
    },
    {
      id: '9', name: 'Rice Noodles', cal: 109, pro: 0.9, fat: 0.2, carb: 25,
      unit: '100g', cat: 'Carbs',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/rice-noodles.png',
      description: 'Light Thai noodle base, gluten-free',
    },
    {
      id: '10', name: 'Sweet Potato', cal: 86, pro: 1.6, fat: 0.1, carb: 20,
      unit: '100g', cat: 'Carbs',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/sweet-potato.png',
      description: 'Rich in beta-carotene and fiber',
    },
  
    // ── Fats ──────────────────────────────────────────────────────────────────
    {
      id: '11', name: 'Avocado', cal: 160, pro: 2, fat: 15, carb: 9,
      unit: '100g', cat: 'Fats',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/avocado.png',
      description: 'Heart-healthy monounsaturated fats',
    },
    {
      id: '12', name: 'Almonds', cal: 579, pro: 21, fat: 49, carb: 22,
      unit: '100g', cat: 'Fats',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/almonds.png',
      description: 'Nutrient-dense, high in vitamin E',
    },
    {
      id: '13', name: 'Coconut Milk', cal: 197, pro: 2, fat: 21, carb: 3,
      unit: '100ml', cat: 'Fats',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/coconut-milk.png',
      description: 'Thai cooking staple, rich MCT fats',
    },
    {
      id: '14', name: 'Peanuts', cal: 567, pro: 26, fat: 49, carb: 16,
      unit: '100g', cat: 'Fats',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/peanuts.png',
      description: 'Used in pad thai sauce and satay',
    },
  
    // ── Fruits ────────────────────────────────────────────────────────────────
    {
      id: '15', name: 'Banana', cal: 89, pro: 1.1, fat: 0.3, carb: 23,
      unit: '100g', cat: 'Fruits',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/bananas.png',
      description: 'Quick energy, high in potassium',
    },
    {
      id: '16', name: 'Mango', cal: 60, pro: 0.8, fat: 0.4, carb: 15,
      unit: '100g', cat: 'Fruits',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/mango.png',
      description: 'Thai favourite, rich in vitamin C',
    },
    {
      id: '17', name: 'Papaya', cal: 43, pro: 0.5, fat: 0.3, carb: 11,
      unit: '100g', cat: 'Fruits',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/papaya.png',
      description: 'Base of som tum, digestive enzymes',
    },
  
    // ── Veggies ───────────────────────────────────────────────────────────────
    {
      id: '18', name: 'Broccoli', cal: 55, pro: 3.7, fat: 0.6, carb: 11,
      unit: '100g', cat: 'Veggies',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/broccoli.png',
      description: 'High in vitamin K and C',
    },
    {
      id: '19', name: 'Thai Basil', cal: 22, pro: 3.2, fat: 0.6, carb: 2.6,
      unit: '100g', cat: 'Veggies',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/fresh-basil.png',
      description: 'Key ingredient in pad krapow',
    },
    {
      id: '20', name: 'Morning Glory', cal: 19, pro: 1.8, fat: 0.2, carb: 3.1,
      unit: '100g', cat: 'Veggies',
      img: 'https://spoonacular.com/cdn/ingredients_100x100/spinach.png',
      description: 'Popular Thai stir-fry vegetable (pak boong)',
    },
  
    // ── Thai Dishes ───────────────────────────────────────────────────────────
    {
      id: '21', name: 'Pad Krapow Moo', cal: 320, pro: 22, fat: 18, carb: 14,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/715538-312x231.jpg',
      description: 'Stir-fried pork with holy basil, iconic Thai dish',
    },
    {
      id: '22', name: 'Pad Thai', cal: 400, pro: 18, fat: 14, carb: 52,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/716268-312x231.jpg',
      description: 'Stir-fried rice noodles with egg, bean sprouts, peanuts',
    },
    {
      id: '23', name: 'Tom Yum Goong', cal: 180, pro: 15, fat: 7, carb: 12,
      unit: '1 bowl', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/654812-312x231.jpg',
      description: 'Spicy shrimp soup with lemongrass and lime',
    },
    {
      id: '24', name: 'Green Curry', cal: 350, pro: 20, fat: 22, carb: 18,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/715769-312x231.jpg',
      description: 'Coconut milk curry with Thai green chili paste',
    },
    {
      id: '25', name: 'Som Tum', cal: 150, pro: 4, fat: 3, carb: 28,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/641975-312x231.jpg',
      description: 'Green papaya salad with lime, chili, fish sauce',
    },
    {
      id: '26', name: 'Khao Man Gai', cal: 450, pro: 35, fat: 12, carb: 48,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/648279-312x231.jpg',
      description: 'Poached chicken over rice with ginger broth',
    },
    {
      id: '27', name: 'Massaman Curry', cal: 380, pro: 18, fat: 24, carb: 22,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/664501-312x231.jpg',
      description: 'Rich curry with potato, peanuts, coconut milk',
    },
    {
      id: '28', name: 'Mango Sticky Rice', cal: 360, pro: 4, fat: 8, carb: 68,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/654959-312x231.jpg',
      description: 'Sweet glutinous rice with fresh mango and coconut cream',
    },
    {
      id: '29', name: 'Pad See Ew', cal: 380, pro: 20, fat: 12, carb: 50,
      unit: '1 serving', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/716381-312x231.jpg',
      description: 'Wide rice noodles stir-fried with soy sauce and egg',
    },
    {
      id: '30', name: 'Tom Kha Gai', cal: 220, pro: 16, fat: 14, carb: 8,
      unit: '1 bowl', cat: 'Thai',
      img: 'https://spoonacular.com/recipeImages/715381-312x231.jpg',
      description: 'Chicken coconut milk soup with galangal and lemongrass',
    },
  ];