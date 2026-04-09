import axiosClient from '../../../shared/api/axiosClient';
import type {
  Recipe,
  RecipeSuggestionParams,
  PantryIngredient,
  TimeOfDay,
  AiRecipeResponse,
} from '../types/recipe.types';
import { MOCK_RECIPES, MEAL_TIME_MAP } from '../mocks/recipeMocks';

// ── Time-of-day helper ────────────────────────────────────────────────────────

export const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getTimeOfDayLabel = (tod: TimeOfDay): string => {
  const labels: Record<TimeOfDay, string> = {
    morning:   'Good morning',
    afternoon: 'Good afternoon',
    evening:   'Good evening',
    night:     'Good night',
  };
  return labels[tod];
};

// ── Prompt builder ────────────────────────────────────────────────────────────
// This builds the full AI prompt. Swap mock data for a real API call by
// setting VITE_AI_API_URL in your .env file.

export const buildRecipePrompt = (params: RecipeSuggestionParams): string => {
  const { timeOfDay, maxPrepTime, pantryIngredients } = params;
  const pantryList =
    pantryIngredients.length > 0
      ? pantryIngredients.map((p) => `${p.name} (${p.quantity} ${p.unit})`).join(', ')
      : 'no specific ingredients (suggest anything suitable)';

  return `
You are a professional nutritionist and chef. Suggest exactly 3 recipes for a user based on the following context:

- Time of day: ${timeOfDay} (suggest appropriate meal types)
- Maximum preparation time: ${maxPrepTime} minutes
- Available pantry ingredients: ${pantryList}

Rules:
1. Each recipe must be completable within ${maxPrepTime} minutes.
2. Prefer recipes that use the available pantry ingredients.
3. The 3 recipes should span different prep times (e.g. one quick, one medium, one closer to the max).
4. For each recipe, provide: title, short description, exact timeToCook (number, in minutes), mealType, ingredients with quantities and whether they are in the pantry, nutritionalData (calories, protein, carbs, fat), and tags.

Respond with a valid JSON object matching this schema:
{
  "recipes": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "timeToCook": number,
      "mealType": "breakfast" | "lunch" | "dinner" | "snack",
      "tags": ["string"],
      "nutritionalData": { "calories": number, "protein": number, "carbs": number, "fat": number },
      "ingredients": [
        { "id": "string", "name": "string", "quantity": "string", "inPantry": boolean }
      ]
    }
  ]
}
`.trim();
};

// ── Cross-reference pantry ────────────────────────────────────────────────────
// Marks ingredients as inPantry if their name matches pantry items (case-insensitive).

const enrichWithPantry = (recipes: Recipe[], pantryIngredients: PantryIngredient[]): Recipe[] => {
  return recipes.map((recipe) => ({
    ...recipe,
    ingredients: recipe.ingredients.map((ing) => {
      const match = pantryIngredients.find(
        (p) => ing.name.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(ing.name.toLowerCase())
      );
      return { ...ing, inPantry: !!match };
    }),
  }));
};

// ── Mock resolver ─────────────────────────────────────────────────────────────

const fetchMockRecipes = (params: RecipeSuggestionParams): Recipe[] => {
  const { timeOfDay, maxPrepTime, pantryIngredients } = params;
  const suitableMealTypes = MEAL_TIME_MAP[timeOfDay] ?? ['lunch'];

  // Filter by meal type and prep time, sort ascending by cook time
  const filtered = MOCK_RECIPES
    .filter((r) => suitableMealTypes.includes(r.mealType) && r.timeToCook <= maxPrepTime)
    .sort((a, b) => a.timeToCook - b.timeToCook);

  // If fewer than 3, fill from any other meal type (also sorted ascending)
  let selected = filtered.slice(0, 3);
  if (selected.length < 3) {
    const extras = MOCK_RECIPES
      .filter((r) => !selected.find((s) => s.id === r.id) && r.timeToCook <= maxPrepTime)
      .sort((a, b) => a.timeToCook - b.timeToCook)
      .slice(0, 3 - selected.length);
    selected = [...selected, ...extras].sort((a, b) => a.timeToCook - b.timeToCook);
  }

  return enrichWithPantry(selected, pantryIngredients);
};

// ── Main service function ─────────────────────────────────────────────────────
// Uses real AI API if VITE_AI_API_URL is set, otherwise falls back to mock data.

export const fetchRecipeSuggestions = async (
  params: RecipeSuggestionParams
): Promise<Recipe[]> => {
  const aiApiUrl = import.meta.env.VITE_AI_API_URL as string | undefined;

  // ── REAL API PATH ─────────────────────────────────────────────────────────
  if (aiApiUrl) {
    try {
      const response = await axiosClient.post<AiRecipeResponse>(
        `${aiApiUrl}/recipes/suggestions`,
        params,
      );
      return enrichWithPantry(response.data.recipes, params.pantryIngredients);
    } catch (error) {
      console.warn('[recipeAiService] AI API call failed, falling back to mock data:', error);
      // Graceful fallback — don't break the UI
    }
  }

  // ── MOCK PATH ─────────────────────────────────────────────────────────────
  // Simulate a realistic async delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  return fetchMockRecipes(params);
};
