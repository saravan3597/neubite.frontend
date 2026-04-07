import React, { useState, useEffect } from 'react';
import { useGroceryPantryStore, type PantryUnit } from '../../../shared/stores/useGroceryPantryStore';
import { IntakeModal } from './IntakeModal';

// ── Component ────────────────────────────────────────────────────────────────

export const GroceryListSection: React.FC = () => {
  const { groceries, addGroceryItem, removeGroceryItem, moveGroceryToPantry } =
    useGroceryPantryStore();

  const unpurchased = groceries.filter((g) => !g.isPurchased);

  // Collapsed by default; auto-opens whenever unpurchased items exist
  const [isExpanded, setIsExpanded] = useState(unpurchased.length > 0);
  const [inputValue, setInputValue] = useState('');
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  // Auto-expand when items are added; auto-collapse when list becomes empty
  useEffect(() => {
    if (unpurchased.length > 0) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [unpurchased.length]);

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    addGroceryItem(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  const handleCheckboxClick = (id: string) => {
    setPendingItemId(id);
  };

  const handleModalSave = (details: { quantity: number; unit: PantryUnit; expiryDate: string }) => {
    if (!pendingItemId) return;
    moveGroceryToPantry(pendingItemId, details);
    setPendingItemId(null);
  };

  const handleModalCancel = () => {
    setPendingItemId(null);
  };

  const pendingItem = groceries.find((g) => g.id === pendingItemId);

  return (
    <>
      <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">

        {/* ── Header (always visible, clickable to toggle) ── */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-text-primary">Grocery List</h2>
            {unpurchased.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary">
                {unpurchased.length}
              </span>
            )}
          </div>

          {/* Chevron */}
          <svg
            className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* ── Collapsible body ── */}
        {isExpanded && (
          <>
            <div className="border-t border-bg-secondary" />
            <div className="p-5 space-y-4">

              {/* Add input */}
              <div className="flex gap-2">
                <input
                  id="grocery-add-input"
                  type="text"
                  placeholder="Add an item (e.g. Chicken Breast)…"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-bg-secondary bg-bg-secondary text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary focus:bg-bg-primary transition-all"
                />
                <button
                  id="grocery-add-btn"
                  onClick={handleAdd}
                  disabled={!inputValue.trim()}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>

              {/* List */}
              {unpurchased.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-text-primary mb-0.5">Your list is empty</p>
                  <p className="text-xs text-text-secondary">Add items above to start your grocery list.</p>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {unpurchased.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-center gap-3 px-3.5 py-3 sm:py-2.5 rounded-xl border border-bg-secondary hover:border-accent-primary/30 hover:bg-bg-secondary/60 transition-all"
                    >
                      {/* Custom checkbox — larger on mobile for touch */}
                      <button
                        id={`grocery-check-${item.id}`}
                        onClick={() => handleCheckboxClick(item.id)}
                        className="shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-md border-2 border-bg-secondary group-hover:border-accent-primary/50 flex items-center justify-center transition-colors hover:bg-accent-primary/10"
                        title="Mark as purchased and add to pantry"
                      >
                        <svg className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-50 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <span className="flex-1 text-sm text-text-primary">{item.name}</span>
                      {/* Remove — always visible on mobile (hover-only on sm+) */}
                      <button
                        onClick={() => removeGroceryItem(item.id)}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 sm:p-1 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 transition-all"
                        title="Remove item"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {unpurchased.length > 0 && (
                <p className="text-xs text-text-secondary text-center">
                  ✓ Check an item to log its quantity and move it to your pantry
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Intake modal */}
      {pendingItem && (
        <IntakeModal
          itemName={pendingItem.name}
          onSave={handleModalSave}
          onCancel={handleModalCancel}
        />
      )}
    </>
  );
};
