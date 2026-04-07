import React from 'react';
import { useRecipeSuggestions } from '../hooks/useRecipeSuggestions';
import { useRecipeStore } from '../../../shared/stores/useRecipeStore';
import { PrepTimeSlider } from './PrepTimeSlider';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { getTimeOfDay, getTimeOfDayLabel } from '../services/recipeAiService';
import type { Recipe } from '../types/recipe.types';

// ── Loading skeleton ──────────────────────────────────────────────────────────

const RecipeSkeleton = () => (
  <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden flex flex-col animate-pulse">
    <div className="h-44 bg-bg-secondary" />
    <div className="p-4 flex flex-col gap-3">
      <div className="h-4 bg-bg-secondary rounded-lg w-3/4" />
      <div className="h-3 bg-bg-secondary rounded-lg w-full" />
      <div className="h-3 bg-bg-secondary rounded-lg w-5/6" />
      <div className="flex gap-2 mt-1">
        <div className="h-6 w-14 bg-bg-secondary rounded-lg" />
        <div className="h-6 w-14 bg-bg-secondary rounded-lg" />
        <div className="h-6 w-14 bg-bg-secondary rounded-lg" />
      </div>
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

export const RecipeSuggestions: React.FC = () => {
  const { recipes, isLoading, error, maxPrepTime, setMaxPrepTime, refresh } =
    useRecipeSuggestions();
  const { saveRecipe, unsaveRecipe, isSaved } = useRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);

  const tod      = getTimeOfDay();
  const greeting = getTimeOfDayLabel(tod);

  return (
    <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 border-b border-bg-secondary">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-text-primary">{greeting}!</h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Here's what you can make right now based on your pantry.
            </p>
          </div>
          <button
            id="recipe-refresh-btn"
            onClick={refresh}
            disabled={isLoading}
            className="shrink-0 p-2 rounded-xl border border-bg-secondary text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary disabled:opacity-40 transition-all"
            title="Refresh suggestions"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Prep time selector */}
        <PrepTimeSlider value={maxPrepTime} onChange={setMaxPrepTime} />
      </div>

      {/* ── Content ── */}
      <div className="p-3 sm:p-5">
        {error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="w-10 h-10 bg-status-error/10 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-status-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-text-secondary">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-semibold transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading
              ? [0, 1, 2].map((i) => <RecipeSkeleton key={i} />)
              : recipes.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm font-medium text-text-primary mb-1">No recipes found</p>
                  <p className="text-xs text-text-secondary">Try increasing the max prep time.</p>
                </div>
              )
              : recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  {...recipe}
                  isSaved={isSaved(recipe.id)}
                  onSave={saveRecipe}
                  onUnsave={unsaveRecipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))
            }
          </div>
        )}
      </div>
      
      {/* Detail Modal */}
      <RecipeModal 
        recipe={selectedRecipe} 
        onClose={() => setSelectedRecipe(null)} 
      />
    </div>
  );
};
