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

// ── Clock icon ────────────────────────────────────────────────────────────────

const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id, title, description, timeToCook, imageUrl, ingredients,
  nutritionalData, tags, isSaved, onSave, onUnsave, onClick,
  ...rest
}) => {
  const recipe: Recipe = { id, title, description, timeToCook, imageUrl, ingredients, nutritionalData, mealType: rest.mealType, tags };
  const inPantryCount  = ingredients.filter((i) => i.inPantry).length;
  const missingCount   = ingredients.filter((i) => !i.inPantry).length;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    isSaved ? onUnsave(id) : onSave(recipe);
  };

  return (
    <div
      className="group relative bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden hover:border-accent-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      {/* ── Image / Placeholder ── */}
      <div className="h-36 sm:h-44 bg-bg-secondary w-full relative overflow-hidden shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-primary">
            <svg className="w-12 h-12 text-text-secondary opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Time badge */}
        <div className="absolute bottom-3 left-3 bg-bg-primary/95 backdrop-blur-sm border border-bg-secondary px-2.5 py-1 rounded-full text-xs font-semibold text-text-primary flex items-center gap-1.5 shadow-sm">
          <ClockIcon />
          {timeToCook} min
        </div>

        {/* Favourite button */}
        <button
          id={`recipe-save-${id}`}
          onClick={handleSaveClick}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border transition-all duration-150 shadow-sm ${
            isSaved
              ? 'bg-accent-primary border-accent-primary text-white'
              : 'bg-bg-primary/90 border-bg-secondary text-text-secondary hover:border-accent-primary hover:text-accent-primary'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          <HeartIcon filled={isSaved} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1 mb-1">
            {title}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{description}</p>
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

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-bg-secondary text-text-secondary">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Ingredients */}
        <div className="mt-auto pt-3 border-t border-bg-secondary">
          <div className="flex items-center gap-2 mb-2">
            {inPantryCount > 0 && (
              <span className="text-[11px] font-semibold text-status-success bg-status-success/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success inline-block" />
                {inPantryCount} in pantry
              </span>
            )}
            {missingCount > 0 && (
              <span className="text-[11px] font-semibold text-text-secondary bg-bg-secondary px-2 py-0.5 rounded-md">
                {missingCount} needed
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 max-h-10 overflow-hidden">
            {ingredients.slice(0, 4).map((ing) => (
              <span
                key={ing.id}
                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium border ${
                  ing.inPantry
                    ? 'bg-status-success/10 text-status-success border-status-success/20'
                    : 'bg-bg-secondary text-text-secondary border-bg-secondary'
                }`}
              >
                {ing.name}
              </span>
            ))}
            {ingredients.length > 4 && (
              <span className="text-[10px] text-text-secondary px-1 py-0.5">
                +{ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
