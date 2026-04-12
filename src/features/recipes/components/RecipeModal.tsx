import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Recipe } from '../types/recipe.types';
import { useGroceryPantryStore } from '../../../shared/stores/useGroceryPantryStore';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const { consumeIngredients } = useGroceryPantryStore();
  const [showWarning, setShowWarning] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = recipe ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [recipe]);

  if (!recipe) return null;

  // Mock instructions if they don't exist
  const steps = recipe.instructions || [
    "Gather and prepare all ingredients from your pantry.",
    "Step 1: Combine the primary ingredients together in a suitable vessel.",
    "Step 2: Follow standard preparation times based on the meal type.",
    "Ensure dish reaches the correct temperature before plating.",
    "Serve hot and enjoy immediately!"
  ];

  const handleConfirmPrepared = () => {
    consumeIngredients(recipe.ingredients);
    onClose();
    setShowWarning(false);
  };

  return createPortal(
    /* Backdrop — items-end on mobile (bottom sheet), items-center on desktop */
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary w-full md:max-w-lg rounded-t-3xl md:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[90vh] animate-in fade-in duration-200"
        onClick={e => e.stopPropagation()}
      >

        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-bg-secondary" />
        </div>

        {/* Header (hidden if showing warning) */}
        {!showWarning && (
          <div className="px-5 py-4 md:px-6 md:py-5 border-b border-bg-secondary flex items-start justify-between bg-bg-secondary/20 shrink-0">
            <div className="pr-4">
              <h2 className="text-lg md:text-xl font-bold text-text-primary mb-1">{recipe.title}</h2>
              <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{recipe.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <button
                onClick={() => setShowWarning(true)}
                className="px-3 py-1.5 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary hover:text-white rounded-lg text-xs font-bold transition-colors"
              >
                Mark Prepared
              </button>
              <button
                onClick={onClose}
                className="p-1.5 -mr-1 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Body Content */}
        {showWarning ? (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-status-warning/10 rounded-full flex items-center justify-center mb-5 shrink-0">
              <svg className="w-8 h-8 text-status-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-2">Update Pantry?</h3>
            <p className="text-sm text-text-secondary mb-8 max-w-sm">
              Marking this recipe as prepared will automatically deduct the used ingredients from your pantry tracker. This action cannot be undone.
            </p>

            <div className="flex w-full gap-3 mt-auto">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 py-3.5 bg-bg-secondary text-text-primary rounded-xl font-bold hover:bg-bg-secondary/70 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmPrepared}
                className="flex-1 py-3.5 bg-status-warning text-white rounded-xl font-bold hover:bg-status-warning/90 transition-colors shadow-sm"
              >
                Yes, deduct items
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 md:p-6 overflow-y-auto flex-1 min-h-0">
            {/* Nutrition Summary */}
            <div className="grid grid-cols-3 gap-3 mb-8 shrink-0">
              <div className="bg-accent-primary/10 rounded-xl p-3 text-center border border-accent-primary/20">
                <span className="block text-[10px] font-bold text-accent-primary uppercase tracking-wider mb-1">Calories</span>
                <span className="text-xl font-bold text-text-primary">{recipe.nutritionalData.calories}</span>
              </div>
              <div className="bg-status-success/10 rounded-xl p-3 text-center border border-status-success/20">
                <span className="block text-[10px] font-bold text-status-success uppercase tracking-wider mb-1">Protein</span>
                <span className="text-xl font-bold text-text-primary">{recipe.nutritionalData.protein}g</span>
              </div>
              <div className="bg-bg-secondary/80 rounded-xl p-3 text-center border border-bg-secondary">
                <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Carbs</span>
                <span className="text-xl font-bold text-text-primary">{recipe.nutritionalData.carbs}g</span>
              </div>
            </div>

            {/* Instructions Timeline */}
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-5 flex items-center gap-2">
              Cooking Instructions
              <span className="font-semibold text-xs text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-md normal-case">
                ~{recipe.timeToCook} mins
              </span>
            </h3>

            <div className="space-y-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-bg-secondary border border-bg-secondary text-text-primary flex items-center justify-center text-xs font-bold z-10 shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="pt-1.5 text-sm text-text-secondary leading-relaxed">
                    {step}
                  </div>
                  {idx !== steps.length - 1 && (
                    <div className="absolute top-8 left-4 w-px h-[calc(100%+16px)] -ml-px bg-bg-secondary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
