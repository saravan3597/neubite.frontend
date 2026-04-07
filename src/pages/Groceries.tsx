import React from 'react';
import { GroceryListSection } from '../features/grocery/components/GroceryListSection';
import { PantrySection } from '../features/grocery/components/PantrySection';
import { useGroceryPantryStore } from '../shared/stores/useGroceryPantryStore';

export const Groceries: React.FC = () => {
  const { groceries, pantryItems } = useGroceryPantryStore();
  const unpurchasedCount = groceries.filter((g) => !g.isPurchased).length;

  return (
    <div className="space-y-6">
      {/* Page subtitle */}
      <p className="text-sm text-text-secondary">
        Track what you need to buy and move items straight into your pantry when you get home.
      </p>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
          <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-sm font-semibold text-accent-primary">{unpurchasedCount} to buy</span>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-status-success/10 border border-status-success/20">
          <svg className="w-4 h-4 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-sm font-semibold text-status-success">{pantryItems.length} in pantry</span>
        </div>
      </div>

      {/* Grocery list */}
      <GroceryListSection />

      {/* Pantry inventory */}
      <PantrySection />
    </div>
  );
};
