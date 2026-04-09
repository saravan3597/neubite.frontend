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
  <div className="bg-bg-primary rounded-2xl border border-bg-secondary p-5 flex flex-col gap-4 animate-pulse">
    <div className="flex justify-between items-start gap-4">
      <div className="space-y-3 flex-1 pt-1">
        <div className="h-5 bg-bg-secondary/70 rounded-lg w-full" />
        <div className="h-5 bg-bg-secondary/70 rounded-lg w-2/3" />
      </div>
      <div className="w-8 h-8 rounded-full bg-bg-secondary/70 shrink-0" />
    </div>
    <div className="flex gap-2 mt-2">
      <div className="h-6 w-16 bg-bg-secondary/70 rounded-lg" />
      <div className="h-6 w-16 bg-bg-secondary/70 rounded-lg" />
      <div className="h-6 w-16 bg-bg-secondary/70 rounded-lg" />
    </div>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

export const RecipeSuggestions: React.FC = () => {
  const { recipes, isLoading, isPantryEmpty, error, maxPrepTime, setMaxPrepTime, refresh } =
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
          {!isPantryEmpty && (
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
          )}
        </div>

        {/* Prep time selector */}
        {!isPantryEmpty && <PrepTimeSlider value={maxPrepTime} onChange={setMaxPrepTime} />}
      </div>

      {/* ── Content ── */}
      <div className="p-3 sm:p-5">
        {isPantryEmpty ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
            <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Your pantry is empty</p>
              <p className="text-xs text-text-secondary mt-1 max-w-[220px]">
                Add some ingredients to your pantry and we'll suggest recipes you can make right now.
              </p>
            </div>
          </div>
        ) : error ? (
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
        ) : recipes.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-medium text-text-primary mb-1">No recipes found</p>
            <p className="text-xs text-text-secondary">Try increasing the max prep time.</p>
          </div>
        ) : (
          /* Mobile: horizontal scroll carousel / Desktop: grid */
          <div className="flex md:grid gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 scrollbar-none pb-2 md:pb-0">
            {isLoading
              ? [0, 1, 2].map((i) => (
                  <div key={i} className="w-72 md:w-auto shrink-0 md:shrink snap-start">
                    <RecipeSkeleton />
                  </div>
                ))
              : recipes.map((recipe) => (
                  <div key={recipe.id} className="w-72 md:w-auto shrink-0 md:shrink snap-start">
                    <RecipeCard
                      {...recipe}
                      isSaved={isSaved(recipe.id)}
                      onSave={saveRecipe}
                      onUnsave={unsaveRecipe}
                      onClick={() => setSelectedRecipe(recipe)}
                    />
                  </div>
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
