import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../../features/recipes/types/recipe.types';

// ── Interface ────────────────────────────────────────────────────────────────

interface RecipeState {
  savedRecipes: Recipe[];
  saveRecipe: (recipe: Recipe) => void;
  unsaveRecipe: (id: string) => void;
  isSaved: (id: string) => boolean;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      savedRecipes: [],

      saveRecipe: (recipe: Recipe) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.some((r) => r.id === recipe.id)
            ? state.savedRecipes
            : [...state.savedRecipes, recipe],
        }));
      },

      unsaveRecipe: (id: string) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((r) => r.id !== id),
        }));
      },

      isSaved: (id: string): boolean => {
        return get().savedRecipes.some((r) => r.id === id);
      },
    }),
    { name: 'neubite-saved-recipes' }
  )
);
