import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const uid = () => crypto.randomUUID();

// ── Types ────────────────────────────────────────────────────────────────────

export interface GroceryItem {
  id: string;
  name: string;
  isPurchased: boolean;
}

export type PantryUnit = 'kgs' | 'litres' | 'units';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: PantryUnit;
  expiryDate: string;
}

// ── Store interface ──────────────────────────────────────────────────────────

interface GroceryPantryState {
  groceries: GroceryItem[];
  pantryItems: PantryItem[];

  addGroceryItem: (name: string) => void;
  removeGroceryItem: (id: string) => void;
  moveGroceryToPantry: (
    groceryId: string,
    details: Omit<PantryItem, 'id' | 'name'>
  ) => void;

  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  removePantryItem: (id: string) => void;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useGroceryPantryStore = create<GroceryPantryState>()(
  persist(
    (set, get) => ({
      groceries: [],
      pantryItems: [],

      addGroceryItem: (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        set((state) => ({
          groceries: [
            ...state.groceries,
            { id: uid(), name: trimmed, isPurchased: false },
          ],
        }));
      },

      removeGroceryItem: (id: string) => {
        set((state) => ({
          groceries: state.groceries.filter((g) => g.id !== id),
        }));
      },

      moveGroceryToPantry: (
        groceryId: string,
        details: Omit<PantryItem, 'id' | 'name'>
      ) => {
        const grocery = get().groceries.find((g) => g.id === groceryId);
        if (!grocery) return;
        set((state) => ({
          groceries: state.groceries.filter((g) => g.id !== groceryId),
          pantryItems: [
            ...state.pantryItems,
            { id: uid(), name: grocery.name, ...details },
          ],
        }));
      },

      addPantryItem: (item: Omit<PantryItem, 'id'>) => {
        set((state) => ({
          pantryItems: [...state.pantryItems, { id: uid(), ...item }],
        }));
      },

      removePantryItem: (id: string) => {
        set((state) => ({
          pantryItems: state.pantryItems.filter((p) => p.id !== id),
        }));
      },
    }),
    { name: 'neubite-grocery-pantry' }
  )
);
