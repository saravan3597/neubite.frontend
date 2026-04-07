import React from 'react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';
import { useRecipeStore } from '../shared/stores/useRecipeStore';
import { RecipeSuggestions } from '../features/recipes/components/RecipeSuggestions';
import { SavedRecipes } from '../features/recipes/components/SavedRecipes';

// ── Stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="bg-bg-primary rounded-xl border border-bg-secondary p-5">
    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold text-text-primary">{value}</p>
    {sub && <p className="text-xs text-text-secondary mt-0.5">{sub}</p>}
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
      {/* Greeting */}
      <p className="text-sm text-text-secondary">
        Welcome back, <span className="font-semibold text-text-primary">{firstName}</span>. Here are your personalised recipe suggestions for today.
      </p>

      {/* Stats row — 1 col mobile, 3 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Saved recipes"
          value={savedRecipes.length}
          sub={savedRecipes.length === 0 ? 'Favourite a recipe below' : 'recipes saved'}
        />
        <StatCard
          label="Pantry items"
          value={pantryItems.length}
          sub={pantryItems.length === 0 ? 'Add via Pantry page' : 'ingredients tracked'}
        />
        <StatCard
          label="To buy"
          value={unpurchasedCount}
          sub={unpurchasedCount === 0 ? 'List is clear' : 'on grocery list'}
        />
      </div>

      {/* AI recipe suggestions */}
      <RecipeSuggestions />

      {/* Saved / favourited recipes */}
      <SavedRecipes />
    </div>
  );
};
