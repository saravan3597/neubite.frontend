import React from 'react';
import { useAuthStore } from '../shared/stores/useAuthStore';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';
import { useRecipeStore } from '../shared/stores/useRecipeStore';
import { RecipeSuggestions } from '../features/recipes/components/RecipeSuggestions';
import { SavedRecipes } from '../features/recipes/components/SavedRecipes';

// ── Stat card ─────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="min-w-[148px] md:min-w-0 shrink-0 md:shrink snap-start bg-bg-primary rounded-xl border border-bg-secondary p-5">
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
      {/* Greeting — desktop only; mobile already has the time-of-day greeting inside the recipe card */}
      <p className="hidden md:block text-sm text-text-secondary">
        Welcome back, <span className="font-semibold text-text-primary">{firstName}</span>. Here are your personalised recipe suggestions for today.
      </p>

      {/* AI recipe suggestions */}
      <RecipeSuggestions />

      <div className="border-t border-bg-secondary pt-6 space-y-6">
        {/* Stats row — horizontal scroll on mobile, 3-col grid on md+ */}
        <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-none pb-1 md:pb-0">
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

        {/* Saved / favourited recipes */}
        <SavedRecipes />
      </div>
    </div>
  );
};
