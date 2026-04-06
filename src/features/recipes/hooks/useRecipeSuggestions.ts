import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '../types/recipe.types';
import {
  fetchRecipeSuggestions,
  getTimeOfDay,
} from '../services/recipeAiService';
import { useGroceryPantryStore } from '../../../shared/stores/useGroceryPantryStore';

// ── Constants ─────────────────────────────────────────────────────────────────

export const PREP_TIME_MIN  = 20;
export const PREP_TIME_MAX  = 60;
export const PREP_TIME_STEP = 5;
export const PREP_TIME_DEFAULT = 60;

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseRecipeSuggestionsReturn {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  maxPrepTime: number;
  setMaxPrepTime: (minutes: number) => void;
  refresh: () => void;
}

export const useRecipeSuggestions = (): UseRecipeSuggestionsReturn => {
  const { pantryItems } = useGroceryPantryStore();

  const [recipes,     setRecipes]     = useState<Recipe[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [maxPrepTime, setMaxPrepTime] = useState(PREP_TIME_DEFAULT);

  const pantryIngredients = pantryItems.map((p) => p.name);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const timeOfDay = getTimeOfDay();
      const result = await fetchRecipeSuggestions({
        timeOfDay,
        maxPrepTime,
        pantryIngredients,
      });
      setRecipes(result);
    } catch {
      setError('Could not load recipe suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  // pantryIngredients is a new array each render, stringify for stable dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrepTime, JSON.stringify(pantryIngredients)]);

  useEffect(() => {
    load();
  }, [load]);

  return { recipes, isLoading, error, maxPrepTime, setMaxPrepTime, refresh: load };
};
