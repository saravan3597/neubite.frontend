import React, { useState } from 'react';
import { useGroceryPantryStore, type PantryUnit } from '../../../shared/stores/useGroceryPantryStore';
import { IntakeModal } from './IntakeModal';

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatExpiry = (iso: string): string => {
  if (!iso) return '—';
  const date = new Date(iso);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const expiryStatus = (iso: string): 'ok' | 'soon' | 'expired' => {
  const now = Date.now();
  const exp = new Date(iso).getTime();
  const diff = exp - now;
  if (diff < 0) return 'expired';
  if (diff < 3 * 24 * 60 * 60 * 1000) return 'soon';
  return 'ok';
};

const ExpiryBadge: React.FC<{ iso: string }> = ({ iso }) => {
  const status = expiryStatus(iso);
  const classes = {
    ok:      'bg-status-success/10 text-status-success',
    soon:    'bg-status-warning/10 text-status-warning',
    expired: 'bg-status-error/10 text-status-error',
  }[status];

  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${classes}`}>
      {formatExpiry(iso)}
    </span>
  );
};

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────

export const PantrySection: React.FC = () => {
  const { pantryItems, removePantryItem, addPantryItem } = useGroceryPantryStore();
  const [newItemName, setNewItemName] = useState('');
  const [pendingItemName, setPendingItemName] = useState<string | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setPendingItemName(newItemName.trim());
  };

  const handleModalSave = (details: { quantity: number; unit: PantryUnit; expiryDate: string }) => {
    if (!pendingItemName) return;
    addPantryItem({ name: pendingItemName, ...details });
    setPendingItemName(null);
    setNewItemName('');
  };

  const handleModalCancel = () => {
    setPendingItemName(null);
  };

  return (
    <>
      <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">

        {/* Header — stacked on mobile, inline on sm+ */}
        <div className="px-4 sm:px-5 py-4 border-b border-bg-secondary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-status-success/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-text-primary">Pantry</h2>
            {pantryItems.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">
                {pantryItems.length}
              </span>
            )}
          </div>

          <form onSubmit={handleAdd} className="flex gap-2 w-full sm:w-auto sm:min-w-[200px]">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add directly to pantry..."
              className="flex-1 sm:w-48 px-3 py-2 text-sm bg-bg-secondary border-none rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-primary text-text-primary placeholder:text-text-secondary"
            />
            <button
              type="submit"
              className="px-3 py-2 text-sm bg-status-success/10 text-status-success hover:bg-status-success/20 rounded-lg transition-colors font-medium shrink-0"
            >
              Add
            </button>
          </form>
        </div>

        {/* Content */}
        {pantryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text-primary mb-0.5">Pantry is empty</p>
            <p className="text-xs text-text-secondary">Check off grocery items above to add them here.</p>
          </div>
        ) : (
          <>
            {/* Mobile: card-based list */}
            <div className="md:hidden divide-y divide-bg-secondary">
              {pantryItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-text-secondary">{item.quantity} {item.unit}</span>
                      <ExpiryBadge iso={item.expiryDate} />
                    </div>
                  </div>
                  <button
                    onClick={() => removePantryItem(item.id)}
                    className="p-2 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 transition-all shrink-0"
                    title="Remove from pantry"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bg-secondary bg-bg-secondary">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Expiry</th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-secondary">
                  {pantryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary">{item.name}</td>
                      <td className="px-5 py-3.5 text-text-secondary">{item.quantity} {item.unit}</td>
                      <td className="px-5 py-3.5">
                        <ExpiryBadge iso={item.expiryDate} />
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => removePantryItem(item.id)}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 transition-all"
                          title="Remove from pantry"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {pendingItemName && (
        <IntakeModal
          itemName={pendingItemName}
          onSave={handleModalSave}
          onCancel={handleModalCancel}
        />
      )}
    </>
  );
};
