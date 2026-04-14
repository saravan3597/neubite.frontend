import React, { useState } from "react";
import {
  useGroceryPantryStore,
  type PantryItem,
  type PantryUnit,
} from "../../../shared/stores/useGroceryPantryStore";
import { IntakeModal } from "./IntakeModal";
import { PantryIcon, TrashIcon, PencilIcon, PlusIcon } from "../../../shared/components/icons";

const formatQty = (n: number) => parseFloat(n.toFixed(1));

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatExpiry = (iso: string): string => {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const expiryStatus = (iso: string): "ok" | "soon" | "expired" => {
  const now = Date.now();
  const exp = new Date(iso).getTime();
  const diff = exp - now;
  if (diff < 0) return "expired";
  if (diff < 3 * 24 * 60 * 60 * 1000) return "soon";
  return "ok";
};

const ExpiryBadge: React.FC<{ iso?: string | null }> = ({ iso }) => {
  if (!iso) return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-bg-secondary text-text-secondary">No expiry</span>;
  const status = expiryStatus(iso);
  const classes = {
    ok: "bg-status-success/10 text-status-success",
    soon: "bg-status-warning/10 text-status-warning",
    expired: "bg-status-error/10 text-status-error",
  }[status];

  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${classes}`}
    >
      {formatExpiry(iso)}
    </span>
  );
};


// ── Component ────────────────────────────────────────────────────────────────

export const PantrySection: React.FC = () => {
  const { pantryItems, removePantryItem, addPantryItem, updatePantryItem } =
    useGroceryPantryStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  const handleModalSave = (details: {
    name: string;
    quantity: number;
    unit: PantryUnit;
    expiryDate: string | null;
  }) => {
    addPantryItem(details);
    setIsAddingNew(false);
  };

  const handleModalCancel = () => {
    setIsAddingNew(false);
    setEditingItem(null);
  };

  const handleEditSave = (details: {
    name: string;
    quantity: number;
    unit: PantryUnit;
    expiryDate: string | null;
  }) => {
    if (!editingItem) return;
    updatePantryItem(editingItem.id, details);
    setEditingItem(null);
  };

  return (
    <>
      <div className="bg-bg-primary rounded-2xl border border-bg-secondary overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-4 border-b border-bg-secondary flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-status-success/10 flex items-center justify-center">
              <PantryIcon className="w-3.5 h-3.5 text-status-success" />
            </div>
            <h2 className="text-base font-semibold text-text-primary">Pantry</h2>
            {pantryItems.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-status-success/10 text-status-success">
                {pantryItems.length}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-bg-secondary text-xs font-semibold text-text-secondary hover:border-status-success/40 hover:text-status-success hover:bg-status-success/5 transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add item
          </button>
        </div>

        {/* Content */}
        {pantryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <div className="w-10 h-10 bg-bg-secondary rounded-xl flex items-center justify-center mb-3">
              <PantryIcon className="w-5 h-5 text-text-secondary" />
            </div>
            <p className="text-sm font-medium text-text-primary mb-0.5">
              Pantry is empty
            </p>
            <p className="text-xs text-text-secondary">
              Check off grocery items above to add them here.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: card-based list */}
            <div className="md:hidden divide-y divide-bg-secondary">
              {pantryItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-text-secondary">
                        {formatQty(item.quantity)} {item.unit}
                      </span>
                      <ExpiryBadge iso={item.expiryDate} />
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-all shrink-0"
                    title="Edit item"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removePantryItem(item.id)}
                    className="p-2 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 transition-all shrink-0"
                    title="Remove from pantry"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-bg-secondary bg-bg-secondary">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-secondary">
                  {pantryItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-bg-secondary/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-text-primary">
                        {item.name}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary">
                        {formatQty(item.quantity)} {item.unit}
                      </td>
                      <td className="px-5 py-3.5">
                        <ExpiryBadge iso={item.expiryDate} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 transition-all"
                            title="Edit item"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removePantryItem(item.id)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-status-error hover:bg-status-error/10 transition-all"
                            title="Remove from pantry"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {isAddingNew && (
        <IntakeModal
          onSave={handleModalSave}
          onCancel={handleModalCancel}
        />
      )}

      {editingItem && (
        <IntakeModal
          itemName={editingItem.name}
          initialValues={{
            quantity: editingItem.quantity,
            unit: editingItem.unit,
            expiryDate: editingItem.expiryDate,
          }}
          onSave={handleEditSave}
          onCancel={handleModalCancel}
        />
      )}
    </>
  );
};
