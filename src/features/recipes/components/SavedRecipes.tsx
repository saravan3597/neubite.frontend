import React, { useState, useEffect } from 'react';
import { useRecipeStore } from '../../../shared/stores/useRecipeStore';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import type { Recipe } from '../types/recipe.types';

// ── Component ─────────────────────────────────────────────────────────────────

export const SavedRecipes: React.FC = () => {
  const { savedRecipes, saveRecipe, unsaveRecipe, isSaved } = useRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Auto-expand when recipes are saved; collapse when empty
  const [isExpanded, setIsExpanded] = useState(savedRecipes.length > 0);

  useEffect(() => {
    setIsExpanded(savedRecipes.length > 0);
  }, [savedRecipes.length]);

  return (
    <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">
      {/* Header — always visible, toggles section */}
      <button
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg-secondary/50 transition-colors"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-accent-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-text-primary">Saved Recipes</h2>
          {savedRecipes.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary">
              {savedRecipes.length}
            </span>
          )}
        </div>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body */}
      {isExpanded && (
        <>
          <div className="border-t border-bg-secondary" />
          <div className="p-5">
            {savedRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-text-primary mb-0.5">No saved recipes yet</p>
                <p className="text-xs text-text-secondary">
                  Tap the ♥ on any recipe suggestion to save it here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    {...recipe}
                    isSaved={isSaved(recipe.id)}
                    onSave={saveRecipe}
                    onUnsave={unsaveRecipe}
                    onClick={() => setSelectedRecipe(recipe)}
                  />
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
