import React from 'react';
import type { Recipe } from '../types/recipe.types';

// ── Props ─────────────────────────────────────────────────────────────────────

interface RecipeCardProps extends Recipe {
  isSaved: boolean;
  onSave: (recipe: Recipe) => void;
  onUnsave: (id: string) => void;
  onClick?: (id: string) => void;
}

// ── Heart icon ────────────────────────────────────────────────────────────────

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    className="w-4 h-4 transition-all duration-150"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id, title, description, timeToCook, imageUrl, ingredients,
  nutritionalData, tags, isSaved, onSave, onUnsave, onClick,
  ...rest
}) => {
  const recipe: Recipe = { id, title, description, timeToCook, imageUrl, ingredients, nutritionalData, mealType: rest.mealType, tags };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    isSaved ? onUnsave(id) : onSave(recipe);
  };

  return (
    <div
      className="group relative bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden hover:border-accent-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer p-5"
      onClick={() => onClick?.(id)}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div>
          <h3 className="text-[1.1rem] leading-snug font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1 mb-1">
            {title}
          </h3>
          {description && <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{description}</p>}
        </div>
        
        {/* Favourite button */}
        <button
          id={`recipe-save-${id}`}
          onClick={handleSaveClick}
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-150 shadow-sm ${
            isSaved
              ? 'bg-accent-primary border-accent-primary text-white'
              : 'bg-bg-primary/90 border-bg-secondary text-text-secondary hover:border-accent-primary hover:text-accent-primary'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          <HeartIcon filled={isSaved} />
        </button>
      </div>

      {/* Nutrition pills */}
      <div className="flex gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 bg-accent-primary/8 rounded-lg">
          <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wide">Cal</span>
          <span className="text-xs font-semibold text-text-primary">{nutritionalData.calories}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-status-success/8 rounded-lg">
          <span className="text-[10px] font-bold text-status-success uppercase tracking-wide">Pro</span>
          <span className="text-xs font-semibold text-text-primary">{nutritionalData.protein}g</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-bg-secondary rounded-lg">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">Carb</span>
          <span className="text-xs font-semibold text-text-primary">{nutritionalData.carbs}g</span>
        </div>
      </div>
    </div>
  );
};
