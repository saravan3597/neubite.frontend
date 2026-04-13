import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../../features/recipes/types/recipe.types';
import { savedRecipesApi } from '../api/savedRecipesApi';

// ── Interface ────────────────────────────────────────────────────────────────

interface RecipeState {
  savedRecipes: Recipe[];
  loadFromServer: () => Promise<void>;
  saveRecipe: (recipe: Recipe) => void;
  unsaveRecipe: (id: string) => void;
  isSaved: (id: string) => boolean;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      savedRecipes: [],

      loadFromServer: async () => {
        try {
          const savedRecipes = await savedRecipesApi.fetchAll();
          set({ savedRecipes });
        } catch {
          // Server unavailable — keep existing localStorage state
        }
      },

      saveRecipe: (recipe: Recipe) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.some((r) => r.id === recipe.id)
            ? state.savedRecipes
            : [...state.savedRecipes, recipe],
        }));
        savedRecipesApi.save(recipe).catch(() => undefined);
      },

      unsaveRecipe: (id: string) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((r) => r.id !== id),
        }));
        savedRecipesApi.remove(id).catch(() => undefined);
      },

      isSaved: (id: string): boolean => {
        return get().savedRecipes.some((r) => r.id === id);
      },
    }),
    { name: 'neubite-saved-recipes' }
  )
);
