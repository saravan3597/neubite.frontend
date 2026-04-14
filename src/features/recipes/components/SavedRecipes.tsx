import React, { useState } from 'react';
import { useRecipeStore } from '../../../shared/stores/useRecipeStore';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import type { Recipe } from '../types/recipe.types';
import { HeartIcon, ChevronDownIcon } from '../../../shared/components/icons';

// ── Component ─────────────────────────────────────────────────────────────────

export const SavedRecipes: React.FC = () => {
  const { savedRecipes, saveRecipe, unsaveRecipe, isSaved } = useRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const [isExpanded, setIsExpanded] = useState(savedRecipes.length > 0);

  return (
    <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">
      {/* Header — always visible, toggles section */}
      <button
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg-secondary/50 transition-colors"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <HeartIcon className="w-3.5 h-3.5 text-accent-primary" active />
          </div>
          <h2 className="text-base font-semibold text-text-primary">Saved Recipes</h2>
          {savedRecipes.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary">
              {savedRecipes.length}
            </span>
          )}
        </div>

        <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Body */}
      {isExpanded && (
        <>
          <div className="border-t border-bg-secondary" />
          <div className="p-3 sm:p-5">
            {savedRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center mb-3">
                  <HeartIcon className="w-5 h-5 text-text-secondary" />
                </div>
                <p className="text-sm font-medium text-text-primary mb-0.5">No saved recipes yet</p>
                <p className="text-xs text-text-secondary">
                  Tap the ♥ on any recipe suggestion to save it here.
                </p>
              </div>
            ) : (
              /* Mobile: horizontal scroll carousel / Desktop: grid */
              <div className="flex md:grid gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-2 lg:grid-cols-3 scrollbar-none pb-2 md:pb-0">
                {savedRecipes.map((recipe) => (
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
        </>
      )}

      {/* Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};
