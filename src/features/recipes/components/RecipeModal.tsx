import React, { useEffect } from 'react';
import type { Recipe } from '../types/recipe.types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (recipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-bg-primary w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-bg-secondary flex items-start justify-between bg-bg-secondary/20">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1.5">{recipe.title}</h2>
            <p className="text-xs text-text-secondary leading-relaxed">{recipe.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl text-text-secondary hover:bg-bg-secondary hover:text-accent-primary transition-colors ml-4 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          {/* Nutrition Summary */}
          <div className="grid grid-cols-3 gap-3 mb-8">
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
          
          <div className="space-y-6">
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
      </div>
    </div>
  );
};
