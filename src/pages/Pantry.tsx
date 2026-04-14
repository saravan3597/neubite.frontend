import React from 'react';
import { GroceryListSection } from '../features/grocery/components/GroceryListSection';
import { PantrySection } from '../features/grocery/components/PantrySection';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';
import { GroceryIcon, PantryIcon } from '../shared/components/icons';

export const Pantry: React.FC = () => {
  const { groceries, pantryItems } = useGroceryPantryStore();
  const unpurchasedCount = groceries.filter((g) => !g.isPurchased).length;

  return (
    <div className="space-y-6">
      {/* Page subtitle */}
      <p className="text-sm text-text-secondary">
        Manage your grocery list and ingredient inventory in one place.
      </p>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
          <GroceryIcon className="w-4 h-4 text-accent-primary" />
          <span className="text-sm font-semibold text-accent-primary">{unpurchasedCount} to buy</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-status-success/10 border border-status-success/20">
          <PantryIcon className="w-4 h-4 text-status-success" />
          <span className="text-sm font-semibold text-status-success">{pantryItems.length} in pantry</span>
        </div>
      </div>

      {/* Grocery list — collapsed by default, auto-expands when items exist */}
      <GroceryListSection />

      {/* Pantry inventory */}
      <PantrySection />
    </div>
  );
};
