import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SellerFavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  moq: number;
}

interface SellerFavoritesState {
  items: SellerFavoriteItem[];
  addFavorite: (item: SellerFavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: SellerFavoriteItem) => void;
}

export const useSellerFavorites = create<SellerFavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      addFavorite: (item) => {
        const currentItems = get().items;
        if (!currentItems.find((i) => i.id === item.id)) {
          set({ items: [...currentItems, item] });
        }
      },
      removeFavorite: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      isFavorite: (id) => {
        return !!get().items.find((i) => i.id === id);
      },
      toggleFavorite: (item) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(item.id)) {
          removeFavorite(item.id);
        } else {
          addFavorite(item);
        }
      },
    }),
    {
      name: 'siver-seller-favorites-storage',
    }
  )
);
