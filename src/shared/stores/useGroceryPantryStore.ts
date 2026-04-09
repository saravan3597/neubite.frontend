import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { pantryApi } from '../api/pantryApi';
import { groceryApi } from '../api/groceryApi';

const uid = () => uuidv4();

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

  loadFromServer: () => Promise<void>;

  addGroceryItem: (name: string) => void;
  removeGroceryItem: (id: string) => void;
  moveGroceryToPantry: (groceryId: string, details: Omit<PantryItem, 'id' | 'name'>) => void;

  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  updatePantryItem: (id: string, updates: Omit<PantryItem, 'id' | 'name'>) => void;
  removePantryItem: (id: string) => void;
  consumeIngredients: (ingredients: { name: string; quantity: string; quantityToDeduct: number; inPantry: boolean }[]) => void;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useGroceryPantryStore = create<GroceryPantryState>()(
  persist(
    (set, get) => ({
      groceries: [],
      pantryItems: [],

      loadFromServer: async () => {
        try {
          const [groceries, pantryItems] = await Promise.all([
            groceryApi.fetchAll(),
            pantryApi.fetchAll(),
          ]);
          set({ groceries, pantryItems });
        } catch {
          // Server unavailable — keep existing localStorage state
        }
      },

      addGroceryItem: (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const item: GroceryItem = { id: uid(), name: trimmed, isPurchased: false };
        set((state) => ({ groceries: [...state.groceries, item] }));
        groceryApi.upsert(item).catch(() => undefined);
      },

      removeGroceryItem: (id: string) => {
        set((state) => ({ groceries: state.groceries.filter((g) => g.id !== id) }));
        groceryApi.remove(id).catch(() => undefined);
      },

      moveGroceryToPantry: (groceryId, details) => {
        const grocery = get().groceries.find((g) => g.id === groceryId);
        if (!grocery) return;
        const pantryItem: PantryItem = { id: uid(), name: grocery.name, ...details };
        set((state) => ({
          groceries: state.groceries.filter((g) => g.id !== groceryId),
          pantryItems: [...state.pantryItems, pantryItem],
        }));
        groceryApi.remove(groceryId).catch(() => undefined);
        pantryApi.upsert(pantryItem).catch(() => undefined);
      },

      addPantryItem: (item) => {
        const pantryItem: PantryItem = { id: uid(), ...item };
        set((state) => ({ pantryItems: [...state.pantryItems, pantryItem] }));
        pantryApi.upsert(pantryItem).catch(() => undefined);
      },

      updatePantryItem: (id, updates) => {
        set((state) => ({
          pantryItems: state.pantryItems.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        pantryApi.update(id, updates).catch(() => undefined);
      },

      removePantryItem: (id) => {
        set((state) => ({ pantryItems: state.pantryItems.filter((p) => p.id !== id) }));
        pantryApi.remove(id).catch(() => undefined);
      },

      consumeIngredients: (ingredients) => {
        set((state) => {
          let updatedPantry = [...state.pantryItems];
          ingredients.forEach((ing) => {
            if (!ing.inPantry) return;
            const lowerIng = ing.name.toLowerCase();
            const hitIndex = updatedPantry.findIndex(
              (p) => p.name.toLowerCase().includes(lowerIng) || lowerIng.includes(p.name.toLowerCase())
            );
            if (hitIndex === -1) return;

            const item = { ...updatedPantry[hitIndex] };
            item.quantity = Math.max(0, item.quantity - ing.quantityToDeduct);

            if (item.quantity <= 0) {
              pantryApi.remove(item.id).catch(() => undefined);
              updatedPantry.splice(hitIndex, 1);
            } else {
              pantryApi.update(item.id, { quantity: item.quantity, unit: item.unit, expiryDate: item.expiryDate }).catch(() => undefined);
              updatedPantry[hitIndex] = item;
            }
          });
          return { pantryItems: updatedPantry };
        });
      },
    }),
    { name: 'neubite-grocery-pantry' }
  )
);
