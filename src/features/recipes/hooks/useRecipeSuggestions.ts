import { useState, useEffect, useCallback, useRef } from 'react';
import type { Recipe } from '../types/recipe.types';
import { fetchRecipeSuggestions, getTimeOfDay } from '../services/recipeAiService';
import { useGroceryPantryStore } from '../../../shared/stores/useGroceryPantryStore';

// ── Constants ─────────────────────────────────────────────────────────────────

export const PREP_TIME_MIN     = 20;
export const PREP_TIME_MAX     = 60;
export const PREP_TIME_STEP    = 5;
export const PREP_TIME_DEFAULT = 60;

// ── Module-level cache ────────────────────────────────────────────────────────
// Persists across route navigations for the lifetime of the SPA session.
// null  = never fetched yet
// []    = fetched, no results
// [...] = has suggestions
let _cache: Recipe[] | null = null;

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseRecipeSuggestionsReturn {
  recipes: Recipe[];
  isLoading: boolean;
  isPantryEmpty: boolean;
  error: string | null;
  maxPrepTime: number;
  setMaxPrepTime: (minutes: number) => void;
  refresh: () => void;
}

export const useRecipeSuggestions = (): UseRecipeSuggestionsReturn => {
  const { pantryItems } = useGroceryPantryStore();

  // Hydrate from cache so navigating back to this route shows instant results
  const [recipes,     setRecipes]     = useState<Recipe[]>(_cache ?? []);
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [maxPrepTime, setMaxPrepTime] = useState(PREP_TIME_DEFAULT);

  const pantryIngredients = pantryItems.map((p) => ({
    name: p.name,
    quantity: p.quantity,
    unit: p.unit,
  }));
  const isPantryEmpty = pantryIngredients.length === 0;

  // Refs so `load` is stable and always reads the latest values
  const pantryRef     = useRef(pantryIngredients);
  const maxPrepRef    = useRef(maxPrepTime);
  pantryRef.current   = pantryIngredients;
  maxPrepRef.current  = maxPrepTime;

  // Stable fetch function — never recreated, always reads fresh refs
  const load = useCallback(async () => {
    if (pantryRef.current.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRecipeSuggestions({
        timeOfDay: getTimeOfDay(),
        maxPrepTime: maxPrepRef.current,
        pantryIngredients: pantryRef.current,
      });
      _cache = result;
      setRecipes(result);
    } catch {
      setError('Could not load recipe suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []); // intentionally empty — uses refs for all values

  // ── Trigger 1: initial load ───────────────────────────────────────────────
  // Fire once when pantry is first available and we have no cached results.
  // Skipped on every subsequent mount (route re-visit) because _cache is set.
  useEffect(() => {
    if (_cache === null && !isPantryEmpty) {
      load();
    }
  // Re-evaluate only when pantry goes from empty → populated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPantryEmpty]);

  // ── Trigger 2: prep time change ───────────────────────────────────────────
  // Skip the first render; only fetch on actual user-driven changes.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPrepTime]);

  return { recipes, isLoading, isPantryEmpty, error, maxPrepTime, setMaxPrepTime, refresh: load };
};
