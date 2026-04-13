// ── Core types ───────────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  inPantry: boolean;
  quantityToDeduct: number;
}

export interface NutritionalData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  timeToCook: number; // minutes
  imageUrl?: string;
  ingredients: Ingredient[];
  instructions?: string[];

  nutritionalData: NutritionalData;
  mealType: MealType;
  tags: string[];
}

// ── AI service params ─────────────────────────────────────────────────────────

export interface PantryIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeSuggestionParams {
  timeOfDay: TimeOfDay;
  maxPrepTime: number;
  pantryIngredients: PantryIngredient[];
}

export interface AiRecipeResponse {
  recipes: Recipe[];
}
