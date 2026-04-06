import React, { useState } from 'react';
import type { PantryUnit } from '../../../shared/stores/useGroceryPantryStore';

// ── Props ────────────────────────────────────────────────────────────────────

interface IntakeModalProps {
  itemName: string;
  onSave: (details: { quantity: number; unit: PantryUnit; expiryDate: string }) => void;
  onCancel: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export const IntakeModal: React.FC<IntakeModalProps> = ({ itemName, onSave, onCancel }) => {
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<PantryUnit>('kgs');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!quantity || Number(quantity) <= 0) next.quantity = 'Enter a valid quantity';
    if (!expiryDate) next.expiryDate = 'Expiry date is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ quantity: Number(quantity), unit, expiryDate });
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full sm:max-w-md bg-bg-primary rounded-t-2xl sm:rounded-2xl shadow-2xl border border-bg-secondary overflow-hidden animate-fade-in">

        {/* Header */}
        <div className="px-6 py-4 bg-bg-sidebar border-b border-bg-sidebar-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-text-sidebar uppercase tracking-wider mb-0.5">
                Moving to Pantry
              </p>
              <h2 className="text-base font-bold text-text-sidebar-active truncate">{itemName}</h2>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-sidebar hover:text-text-sidebar-active hover:bg-bg-sidebar-hover transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">

          {/* Quantity + Unit row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Quantity
              </label>
              <input
                id="intake-quantity"
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 1.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-text-primary bg-bg-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary transition-all ${
                  errors.quantity ? 'border-status-error' : 'border-bg-secondary'
                }`}
              />
              {errors.quantity && (
                <p className="text-xs text-status-error mt-1">{errors.quantity}</p>
              )}
            </div>

            <div className="w-36">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Unit
              </label>
              <select
                id="intake-unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value as PantryUnit)}
                className="w-full px-3 py-2.5 rounded-xl border border-bg-secondary bg-bg-primary text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary transition-all cursor-pointer"
              >
                <option value="kgs">kgs</option>
                <option value="litres">litres</option>
                <option value="units">units</option>
              </select>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Expiry Date
            </label>
            <input
              id="intake-expiry"
              type="date"
              value={expiryDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setExpiryDate(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm text-text-primary bg-bg-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/25 focus:border-accent-primary transition-all ${
                errors.expiryDate ? 'border-status-error' : 'border-bg-secondary'
              }`}
            />
            {errors.expiryDate && (
              <p className="text-xs text-status-error mt-1">{errors.expiryDate}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-bg-secondary text-sm font-semibold text-text-secondary hover:bg-bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            id="intake-save-btn"
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Save to Pantry
          </button>
        </div>
      </div>
    </div>
  );
};
