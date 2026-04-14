import React, { useState, useRef, useEffect } from 'react';
import { useGroceryPantryStore, type PantryUnit } from '../../../shared/stores/useGroceryPantryStore';
import { IntakeModal } from './IntakeModal';
import { GroceryIcon, ChevronDownIcon, PlusIcon, CheckIcon, CloseIcon } from '../../../shared/components/icons';

// ── Component ────────────────────────────────────────────────────────────────

export const GroceryListSection: React.FC = () => {
  const { groceries, addGroceryItem, removeGroceryItem, moveGroceryToPantry } =
    useGroceryPantryStore();

  const unpurchased = groceries.filter((g) => !g.isPurchased);

  const [isExpanded,   setIsExpanded]   = useState(unpurchased.length > 0);
  const [isAdding,     setIsAdding]     = useState(false);
  const [inputValue,   setInputValue]   = useState('');
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (!inputValue.trim()) { setIsAdding(false); return; }
    addGroceryItem(inputValue.trim());
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setIsAdding(false); setInputValue(''); }
  };

  const handleModalSave = (details: { name: string; quantity: number; unit: PantryUnit; expiryDate: string | null }) => {
    if (!pendingItemId) return;
    moveGroceryToPantry(pendingItemId, details);
    setPendingItemId(null);
  };

  const handleModalCancel = () => setPendingItemId(null);

  const pendingItem = groceries.find((g) => g.id === pendingItemId);

  return (
    <>
      <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">

        {/* ── Header ── */}
        <div className="px-4 sm:px-5 py-4 flex items-center justify-between border-b border-bg-secondary">

          {/* Left: icon + title + count — clickable to collapse */}
          <button
            onClick={() => setIsExpanded((p) => !p)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center">
              <GroceryIcon className="w-3.5 h-3.5 text-accent-primary" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Grocery List</h2>
            {unpurchased.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary">
                {unpurchased.length}
              </span>
            )}
            <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>

          {/* Right: Add item button */}
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-bg-secondary text-xs font-semibold text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary hover:bg-accent-primary/5 transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add item
          </button>
        </div>

        {/* ── Collapsible body ── */}
        {isExpanded && (
          <div className="p-4 sm:p-5 space-y-3">

            {/* Inline add input — shown when isAdding */}
            {isAdding && (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="grocery-add-input"
                  type="text"
                  placeholder="e.g. Chicken Breast"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#DDD9D4] bg-bg-primary text-base text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary transition-all"
                />
                <button
                  onClick={handleAdd}
                  disabled={!inputValue.trim()}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => { setIsAdding(false); setInputValue(''); }}
                  className="shrink-0 p-2.5 rounded-xl border border-bg-secondary text-text-secondary hover:bg-bg-secondary transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* List */}
            {unpurchased.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center mb-3">
                  <GroceryIcon className="w-5 h-5 text-text-secondary" />
                </div>
                <p className="text-sm font-medium text-text-primary mb-0.5">Your list is empty</p>
                <p className="text-xs text-text-secondary">Tap "Add item" to start your grocery list.</p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {unpurchased.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-center gap-3 px-3.5 py-3 sm:py-2.5 rounded-xl border border-bg-secondary hover:border-accent-primary/30 hover:bg-bg-secondary/60 transition-all"
                  >
                    <button
                      id={`grocery-check-${item.id}`}
                      onClick={() => setPendingItemId(item.id)}
                      className="shrink-0 w-6 h-6 sm:w-5 sm:h-5 rounded-md border-2 border-bg-secondary group-hover:border-accent-primary/50 flex items-center justify-center transition-colors hover:bg-accent-primary/10"
                      title="Mark as purchased and add to pantry"
                    >
                      <CheckIcon className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-50 transition-opacity" />
                    </button>
                    <span className="flex-1 text-sm text-text-primary">{item.name}</span>
                    <button
                      onClick={() => removeGroceryItem(item.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 sm:p-1 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 transition-all"
                      title="Remove item"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {unpurchased.length > 0 && (
              <p className="text-xs text-text-secondary text-center">
                Check an item to log its quantity and move it to your pantry
              </p>
            )}
          </div>
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
