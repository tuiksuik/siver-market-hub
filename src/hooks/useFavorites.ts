import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
}

export const useFavorites = create<FavoritesState>()(
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
      name: 'siver-favorites-storage',
    }
  )
);
