// ── Core types ───────────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  inPantry: boolean;
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
  nutritionalData: NutritionalData;
  mealType: MealType;
  tags: string[];
}

// ── AI service params ─────────────────────────────────────────────────────────

export interface RecipeSuggestionParams {
  timeOfDay: TimeOfDay;
  maxPrepTime: number;
  pantryIngredients: string[];
}

export interface AiRecipeResponse {
  recipes: Recipe[];
}
