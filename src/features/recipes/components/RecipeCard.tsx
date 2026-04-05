import React from 'react';

export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
}

export interface NutritionalData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  matchedIngredients: Ingredient[];
  missingIngredients: Ingredient[];
  nutritionalData: NutritionalData;
  timeToCook: string;
  onClick?: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  id,
  title,
  imageUrl,
  matchedIngredients,
  missingIngredients,
  nutritionalData,
  timeToCook,
  onClick,
}) => {
  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-brand-300 hover:shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() => onClick && onClick(id)}
    >
      <div className="h-44 bg-surface-100 w-full relative overflow-hidden group-hover:opacity-95 transition-opacity">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-surface-100 to-slate-200 flex items-center justify-center">
            {/* Minimal line art icon placeholder */}
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
        
        {/* Time Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timeToCook}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-[1.1rem] leading-snug font-bold text-surface-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-1">
          {title}
        </h3>
        
        {/* Stats Row */}
        <div className="flex gap-4 text-sm font-medium text-slate-600 mb-5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-50 rounded-lg">
            <span className="text-orange-500">🔥</span> 
            {nutritionalData.calories} <span className="text-slate-400 font-normal">cal</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-50 rounded-lg">
            <span className="text-rose-500">🥩</span> 
            {nutritionalData.protein}g <span className="text-slate-400 font-normal">pro</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-medium mb-3">
            <div className="flex gap-3">
               <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 {matchedIngredients.length} Matched
               </span>
               {missingIngredients.length > 0 && (
                 <span className="flex items-center gap-1 text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                   {missingIngredients.length} Missing
                 </span>
               )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-12">
            {matchedIngredients.slice(0, 3).map(ing => (
              <span key={ing.id} className="inline-flex items-center bg-emerald-50/50 text-emerald-700 border border-emerald-100/50 rounded-md px-2 py-1 text-[11px] font-medium tracking-wide">
                {ing.name}
              </span>
            ))}
            {missingIngredients.slice(0, 2).map(ing => (
              <span key={ing.id} className="inline-flex items-center bg-surface-50 text-slate-500 border border-slate-200 rounded-md px-2 py-1 text-[11px] font-medium tracking-wide">
                {ing.name}
              </span>
            ))}
            {(matchedIngredients.length + missingIngredients.length > 5) && (
              <span className="inline-flex items-center bg-surface-50 text-slate-400 border border-slate-100 rounded-md px-2 py-1 text-[11px] font-medium">
                +{ (matchedIngredients.length + missingIngredients.length) - 5 }
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
