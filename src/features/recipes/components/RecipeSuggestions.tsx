import React from 'react';
import { useRecipeSuggestions } from '../hooks/useRecipeSuggestions';
import { useRecipeStore } from '../../../shared/stores/useRecipeStore';
import { PrepTimeSlider } from './PrepTimeSlider';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { getTimeOfDay, getTimeOfDayLabel } from '../services/recipeAiService';
import type { Recipe } from '../types/recipe.types';
import { RefreshIcon, PantryIcon, AlertCircleIcon } from '../../../shared/components/icons';

// ── Cooking step loader ───────────────────────────────────────────────────────

const STEPS = [
  'Checking your pantry…',
  'Picking recipes for you…',
  'Calculating prep times…',
  'Adding a pinch of magic…',
  'Almost ready to serve…',
];
const STEP_MS = 1200;

const RecipeLoader = () => {
  const [step, setStep] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
        setVisible(true);
      }, 200);
    }, STEP_MS);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-accent-primary animate-bounce"
            style={{ animationDelay: `${i * 160}ms` }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <p
          className="text-sm font-semibold text-text-primary tracking-wide transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {STEPS[step]}
        </p>
        <p className="text-xs text-text-secondary">This takes about a moment</p>
      </div>
    </div>
  );
};

// Minimum ms to show the loader even if the API responds faster
const MIN_LOADING_MS = 2800;

// ── Component ─────────────────────────────────────────────────────────────────

export const RecipeSuggestions: React.FC = () => {
  const { recipes, isLoading, isPantryEmpty, error, maxPrepTime, setMaxPrepTime, refresh } =
    useRecipeSuggestions();
  const { saveRecipe, unsaveRecipe, isSaved } = useRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);

  // Keep the loader visible for at least MIN_LOADING_MS so it doesn't flash
  const [visibleLoading, setVisibleLoading] = React.useState(false);
  const loadStartRef = React.useRef<number>(0);
  React.useEffect(() => {
    if (isLoading) {
      loadStartRef.current = Date.now();
      setVisibleLoading(true);
    } else {
      const remaining = MIN_LOADING_MS - (Date.now() - loadStartRef.current);
      if (remaining > 0) {
        const t = setTimeout(() => setVisibleLoading(false), remaining);
        return () => clearTimeout(t);
      }
      setVisibleLoading(false);
    }
  }, [isLoading]);

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
              disabled={visibleLoading}
              className="shrink-0 p-2 rounded-xl border border-bg-secondary text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary disabled:opacity-40 transition-all"
              title="Refresh suggestions"
            >
              <RefreshIcon className={`w-4 h-4 ${visibleLoading ? 'animate-spin' : ''}`} />
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
              <PantryIcon className="w-6 h-6 text-text-secondary" />
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
              <AlertCircleIcon className="w-5 h-5 text-status-error" />
            </div>
            <p className="text-sm text-text-secondary">{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-semibold transition-colors"
            >
              Try again
            </button>
          </div>
        ) : visibleLoading ? (
          <RecipeLoader />
        ) : recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-medium text-text-primary mb-1">No recipes found</p>
            <p className="text-xs text-text-secondary">Try increasing the max prep time.</p>
          </div>
        ) : (
          /* Mobile: horizontal scroll carousel / Desktop: grid */
          <div className="flex md:grid gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 scrollbar-none pb-2 md:pb-0">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="w-72 md:w-auto shrink-0 md:shrink snap-start">
                <RecipeCard
                  {...recipe}
                  isSaved={isSaved(recipe.id)}
                  onSave={saveRecipe}
                  onUnsave={unsaveRecipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              </div>
            ))}
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
