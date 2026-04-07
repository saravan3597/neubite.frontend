import type { Recipe } from '../types/recipe.types';

// ── Mock data — 9 recipes across breakfast / lunch / dinner ─────────────────
// timeToCook purposely spans 20–60 min so the prep-time filter is meaningful.

export const MOCK_RECIPES: Recipe[] = [
  // ── Breakfast ──────────────────────────────────────────────────────────────
  {
    id: 'b1',
    title: 'Greek Yogurt Parfait',
    description: 'Creamy Greek yogurt layered with honey-drizzled granola and fresh mixed berries. Quick, nutritious and no cooking needed.',
    timeToCook: 20,
    mealType: 'breakfast',
    tags: ['quick', 'no-cook', 'high-protein'],
    nutritionalData: { calories: 320, protein: 22, carbs: 42, fat: 6 },
    ingredients: [
      { id: 'i1', name: 'Greek Yogurt', quantity: '200g', inPantry: false },
      { id: 'i2', name: 'Granola', quantity: '50g', inPantry: false },
      { id: 'i3', name: 'Mixed Berries', quantity: '80g', inPantry: false },
      { id: 'i4', name: 'Honey', quantity: '1 tbsp', inPantry: false },
    ],
  },
  {
    id: 'b2',
    title: 'Spinach & Feta Omelette',
    description: 'Fluffy 3-egg omelette stuffed with wilted spinach, creamy feta and sun-dried tomatoes. A protein-packed start to the day.',
    timeToCook: 20,
    mealType: 'breakfast',
    tags: ['high-protein', 'low-carb', 'gluten-free'],
    nutritionalData: { calories: 380, protein: 32, carbs: 5, fat: 26 },
    ingredients: [
      { id: 'i5', name: 'Eggs', quantity: '3 large', inPantry: false },
      { id: 'i6', name: 'Spinach', quantity: '60g', inPantry: false },
      { id: 'i7', name: 'Feta Cheese', quantity: '40g', inPantry: false },
      { id: 'i8', name: 'Olive Oil', quantity: '1 tsp', inPantry: false },
    ],
  },
  {
    id: 'b3',
    title: 'Overnight Oat Bowls',
    description: 'Rolled oats soaked overnight in oat milk, topped with banana slices, chia seeds and almond butter. Prep the night before.',
    timeToCook: 25,
    mealType: 'breakfast',
    tags: ['meal-prep', 'vegan', 'fiber-rich'],
    nutritionalData: { calories: 440, protein: 14, carbs: 68, fat: 12 },
    ingredients: [
      { id: 'i9', name: 'Rolled Oats', quantity: '80g', inPantry: false },
      { id: 'i10', name: 'Oat Milk', quantity: '200ml', inPantry: false },
      { id: 'i11', name: 'Banana', quantity: '1 medium', inPantry: false },
      { id: 'i12', name: 'Chia Seeds', quantity: '1 tbsp', inPantry: false },
      { id: 'i13', name: 'Almond Butter', quantity: '1 tbsp', inPantry: false },
    ],
  },

  // ── Lunch ──────────────────────────────────────────────────────────────────
  {
    id: 'l1',
    title: 'Grilled Chicken Caesar Wrap',
    description: 'Tender grilled chicken breast, crisp romaine, parmesan shavings and Caesar dressing wrapped in a warm whole-wheat tortilla.',
    timeToCook: 30,
    mealType: 'lunch',
    tags: ['high-protein', 'balanced'],
    nutritionalData: { calories: 520, protein: 46, carbs: 38, fat: 18 },
    ingredients: [
      { id: 'i14', name: 'Chicken Breast', quantity: '200g', inPantry: false },
      { id: 'i15', name: 'Romaine Lettuce', quantity: '80g', inPantry: false },
      { id: 'i16', name: 'Parmesan', quantity: '20g', inPantry: false },
      { id: 'i17', name: 'Caesar Dressing', quantity: '2 tbsp', inPantry: false },
      { id: 'i18', name: 'Whole-Wheat Tortilla', quantity: '1 large', inPantry: false },
    ],
  },
  {
    id: 'l2',
    title: 'Quinoa & Roasted Veggie Bowl',
    description: 'Fluffy quinoa topped with oven-roasted sweet potato, red pepper and chickpeas, finished with a zesty lemon-tahini drizzle.',
    timeToCook: 40,
    mealType: 'lunch',
    tags: ['vegan', 'meal-prep', 'high-fiber'],
    nutritionalData: { calories: 490, protein: 18, carbs: 72, fat: 14 },
    ingredients: [
      { id: 'i19', name: 'Quinoa', quantity: '100g', inPantry: false },
      { id: 'i20', name: 'Sweet Potato', quantity: '150g', inPantry: false },
      { id: 'i21', name: 'Red Bell Pepper', quantity: '1 medium', inPantry: false },
      { id: 'i22', name: 'Chickpeas', quantity: '100g', inPantry: false },
      { id: 'i23', name: 'Tahini', quantity: '1 tbsp', inPantry: false },
      { id: 'i24', name: 'Lemon', quantity: '½', inPantry: false },
    ],
  },
  {
    id: 'l3',
    title: 'Tuna Avocado Rice Bowl',
    description: 'Seared sesame tuna over steamed jasmine rice with sliced avocado, edamame and a drizzle of sriracha mayo.',
    timeToCook: 30,
    mealType: 'lunch',
    tags: ['omega-3', 'high-protein', 'asian'],
    nutritionalData: { calories: 580, protein: 42, carbs: 55, fat: 20 },
    ingredients: [
      { id: 'i25', name: 'Tuna Steak', quantity: '180g', inPantry: false },
      { id: 'i26', name: 'Jasmine Rice', quantity: '100g', inPantry: false },
      { id: 'i27', name: 'Avocado', quantity: '½', inPantry: false },
      { id: 'i28', name: 'Edamame', quantity: '60g', inPantry: false },
      { id: 'i29', name: 'Sriracha', quantity: '1 tsp', inPantry: false },
      { id: 'i30', name: 'Sesame Seeds', quantity: '1 tsp', inPantry: false },
    ],
  },

  // ── Dinner ─────────────────────────────────────────────────────────────────
  {
    id: 'd1',
    title: 'Beef & Broccoli Stir-Fry',
    description: 'Tender strips of sirloin and crisp broccoli tossed in a rich oyster and ginger sauce, served over steamed jasmine rice.',
    timeToCook: 35,
    mealType: 'dinner',
    tags: ['high-protein', 'asian', 'quick'],
    nutritionalData: { calories: 610, protein: 52, carbs: 48, fat: 22 },
    ingredients: [
      { id: 'i31', name: 'Sirloin Beef', quantity: '220g', inPantry: false },
      { id: 'i32', name: 'Broccoli', quantity: '200g', inPantry: false },
      { id: 'i33', name: 'Oyster Sauce', quantity: '2 tbsp', inPantry: false },
      { id: 'i34', name: 'Fresh Ginger', quantity: '1 tsp', inPantry: false },
      { id: 'i35', name: 'Jasmine Rice', quantity: '100g', inPantry: false },
      { id: 'i36', name: 'Soy Sauce', quantity: '1 tbsp', inPantry: false },
    ],
  },
  {
    id: 'd2',
    title: 'Baked Lemon Herb Salmon',
    description: 'Salmon fillet roasted with garlic, lemon zest and fresh dill, paired with oven-baked asparagus and herbed new potatoes.',
    timeToCook: 45,
    mealType: 'dinner',
    tags: ['omega-3', 'gluten-free', 'balanced'],
    nutritionalData: { calories: 540, protein: 48, carbs: 32, fat: 24 },
    ingredients: [
      { id: 'i37', name: 'Salmon Fillet', quantity: '200g', inPantry: false },
      { id: 'i38', name: 'Asparagus', quantity: '150g', inPantry: false },
      { id: 'i39', name: 'New Potatoes', quantity: '200g', inPantry: false },
      { id: 'i40', name: 'Lemon', quantity: '1', inPantry: false },
      { id: 'i41', name: 'Fresh Dill', quantity: '1 tbsp', inPantry: false },
      { id: 'i42', name: 'Garlic', quantity: '2 cloves', inPantry: false },
    ],
  },
  {
    id: 'd3',
    title: 'Creamy Tuscan Chicken Pasta',
    description: 'Pan-seared chicken thighs in a sun-dried tomato cream sauce with baby spinach, tossed through al dente penne.',
    timeToCook: 40,
    mealType: 'dinner',
    tags: ['comfort', 'italian', 'crowd-pleaser'],
    nutritionalData: { calories: 720, protein: 48, carbs: 62, fat: 28 },
    ingredients: [
      { id: 'i43', name: 'Chicken Thighs', quantity: '240g', inPantry: false },
      { id: 'i44', name: 'Penne Pasta', quantity: '120g', inPantry: false },
      { id: 'i45', name: 'Heavy Cream', quantity: '100ml', inPantry: false },
      { id: 'i46', name: 'Sun-Dried Tomatoes', quantity: '40g', inPantry: false },
      { id: 'i47', name: 'Baby Spinach', quantity: '60g', inPantry: false },
      { id: 'i48', name: 'Parmesan', quantity: '30g', inPantry: false },
      { id: 'i49', name: 'Garlic', quantity: '3 cloves', inPantry: false },
    ],
  },
];

// Mealtype → TimeOfDay mapping
export const MEAL_TIME_MAP: Record<string, string[]> = {
  morning:   ['breakfast'],
  afternoon: ['lunch', 'snack'],
  evening:   ['dinner', 'lunch'],
  night:     ['dinner', 'snack'],
};
