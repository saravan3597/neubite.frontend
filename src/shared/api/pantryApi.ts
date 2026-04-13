import axiosClient from './axiosClient';
import type { PantryItem } from '../stores/useGroceryPantryStore';

const BASE = '/pantry';

export const pantryApi = {
  fetchAll: (): Promise<PantryItem[]> =>
    axiosClient.get<PantryItem[]>(BASE).then((r) => r.data),

  upsert: (item: PantryItem): Promise<PantryItem> =>
    axiosClient.post<PantryItem>(BASE, item).then((r) => r.data),

  update: (id: string, updates: Partial<Omit<PantryItem, 'id' | 'name'>>): Promise<PantryItem> =>
    axiosClient.patch<PantryItem>(`${BASE}/${id}`, updates).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axiosClient.delete(`${BASE}/${id}`).then(() => undefined),

  bulkReplace: (items: PantryItem[]): Promise<PantryItem[]> =>
    axiosClient.post<PantryItem[]>(`${BASE}/bulk`, { items }).then((r) => r.data),
};
