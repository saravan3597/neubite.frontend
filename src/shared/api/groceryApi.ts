import axiosClient from './axiosClient';
import type { GroceryItem } from '../stores/useGroceryPantryStore';

const BASE = '/grocery';

export const groceryApi = {
  fetchAll: (): Promise<GroceryItem[]> =>
    axiosClient.get<GroceryItem[]>(BASE).then((r) => r.data),

  upsert: (item: GroceryItem): Promise<GroceryItem> =>
    axiosClient.post<GroceryItem>(BASE, item).then((r) => r.data),

  setPurchased: (id: string, isPurchased: boolean): Promise<GroceryItem> =>
    axiosClient.patch<GroceryItem>(`${BASE}/${id}/purchased`, { isPurchased }).then((r) => r.data),

  remove: (id: string): Promise<void> =>
    axiosClient.delete(`${BASE}/${id}`).then(() => undefined),

  bulkReplace: (items: GroceryItem[]): Promise<GroceryItem[]> =>
    axiosClient.post<GroceryItem[]>(`${BASE}/bulk`, { items }).then((r) => r.data),
};
