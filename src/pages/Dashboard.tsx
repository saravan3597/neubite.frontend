import React from 'react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';
import { useRecipeStore } from '../shared/stores/useRecipeStore';
import { RecipeSuggestions } from '../features/recipes/components/RecipeSuggestions';
import { SavedRecipes } from '../features/recipes/components/SavedRecipes';

// ── Stats strip ───────────────────────────────────────────────────────────────
import { BookmarkIcon, PantryIcon, GroceryIcon } from '../shared/components/icons';

interface StatItemProps { icon: React.ReactNode; value: number; label: string; }
const StatItem = ({ icon, value, label }: StatItemProps) => (
  <div className="flex-1 flex items-center justify-center gap-2 py-2.5">
    <span className="text-text-secondary">{icon}</span>
    <div className="flex items-baseline gap-1.5">
      <span className="text-lg font-bold text-text-primary tabular-nums">{value}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
  const { user }                   = useAuthStore();
  const { pantryItems, groceries } = useGroceryPantryStore();
  const { savedRecipes }           = useRecipeStore();

  const firstName        = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const unpurchasedCount = groceries.filter((g) => !g.isPurchased).length;

  return (
    <div className="space-y-6">
      {/* Greeting — desktop only; mobile already has the time-of-day greeting inside the recipe card */}
      <p className="hidden md:block text-sm text-text-secondary">
        Welcome back, <span className="font-semibold text-text-primary">{firstName}</span>. Here are your personalised recipe suggestions for today.
      </p>

      {/* AI recipe suggestions */}
      <RecipeSuggestions />

      <div className="space-y-4">
        {/* Compact stats strip */}
        <div className="bg-bg-primary rounded-2xl border border-bg-secondary flex divide-x divide-bg-secondary overflow-hidden">
          <StatItem icon={<BookmarkIcon className="w-4 h-4" />} value={savedRecipes.length} label="saved" />
          <StatItem icon={<PantryIcon   className="w-4 h-4" />} value={pantryItems.length}  label="in pantry" />
          <StatItem icon={<GroceryIcon  className="w-4 h-4" />} value={unpurchasedCount}    label="to buy" />
        </div>

        {/* Saved / favourited recipes */}
        <SavedRecipes />
      </div>
    </div>
  );
};
