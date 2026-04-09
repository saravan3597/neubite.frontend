import axiosClient from './axiosClient';
import type { Recipe } from '../../features/recipes/types/recipe.types';

const BASE = '/saved-recipes';

export const savedRecipesApi = {
  fetchAll: (): Promise<Recipe[]> =>
    axiosClient.get<Recipe[]>(BASE).then((r) => r.data),

  save: (recipe: Recipe): Promise<void> =>
    axiosClient.post(BASE, { recipeId: recipe.id, data: recipe }).then(() => undefined),

  remove: (recipeId: string): Promise<void> =>
    axiosClient.delete(`${BASE}/${recipeId}`).then(() => undefined),
};
