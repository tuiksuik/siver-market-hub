import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

export interface SellerCatalogItem {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string | null;
  precioVenta: number;
  precioCosto: number;
  stock: number;
  images: string[];
  isActive: boolean;
  importedAt: string;
  sourceProductId: string | null;
}

export const useSellerCatalog = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SellerCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storeId, setStoreId] = useState<string | null>(null);

  // Fetch seller's store and catalog
  const fetchCatalog = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Get seller's store
      const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('id')
        .eq('owner_user_id', user.id)
        .maybeSingle();

      if (storeError) throw storeError;

      if (!store) {
        setItems([]);
        setIsLoading(false);
        return;
      }

      setStoreId(store.id);

      // Get catalog items
      const { data: catalogItems, error: catalogError } = await supabase
        .from('seller_catalog')
        .select('*')
        .eq('seller_store_id', store.id)
        .order('imported_at', { ascending: false });

      if (catalogError) throw catalogError;

      const mappedItems: SellerCatalogItem[] = (catalogItems || []).map(item => {
        // Parse images from JSONB
        let images: string[] = [];
        if (item.images) {
          if (Array.isArray(item.images)) {
            images = item.images.filter((img): img is string => typeof img === 'string');
          }
        }

        return {
          id: item.id,
          sku: item.sku,
          nombre: item.nombre,
          descripcion: item.descripcion,
          precioVenta: Number(item.precio_venta),
          precioCosto: Number(item.precio_costo),
          stock: item.stock,
          images,
          isActive: item.is_active ?? true,
          importedAt: item.imported_at || '',
          sourceProductId: item.source_product_id,
        };
      });

      setItems(mappedItems);
    } catch (error) {
      console.error('Error fetching catalog:', error);
      toast.error('Error al cargar catálogo');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Update sale price
  const updatePrecioVenta = useCallback(async (itemId: string, newPrice: number) => {
    if (newPrice < 0) {
      toast.error('El precio no puede ser negativo');
      return false;
    }

    try {
      const { error } = await supabase
        .from('seller_catalog')
        .update({ precio_venta: newPrice })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, precioVenta: newPrice } : item
        )
      );

      toast.success('Precio actualizado');
      return true;
    } catch (error) {
      console.error('Error updating price:', error);
      toast.error('Error al actualizar precio');
      return false;
    }
  }, []);

  // Toggle active status
  const toggleActive = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;

    try {
      const { error } = await supabase
        .from('seller_catalog')
        .update({ is_active: !item.isActive })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, isActive: !i.isActive } : i
        )
      );

      toast.success(item.isActive ? 'Producto desactivado' : 'Producto activado');
      return true;
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Error al cambiar estado');
      return false;
    }
  }, [items]);

  // Update stock manually
  const updateStock = useCallback(async (itemId: string, newStock: number, reason?: string) => {
    if (newStock < 0) {
      toast.error('El stock no puede ser negativo');
      return false;
    }

    const item = items.find(i => i.id === itemId);
    if (!item) return false;

    try {
      const { error: updateError } = await supabase
        .from('seller_catalog')
        .update({ stock: newStock })
        .eq('id', itemId);

      if (updateError) throw updateError;

      // Record inventory movement
      const { error: movementError } = await supabase
        .from('inventory_movements')
        .insert({
          seller_catalog_id: itemId,
          change_amount: newStock - item.stock,
          previous_stock: item.stock,
          new_stock: newStock,
          reason: reason || 'Ajuste manual de inventario',
          created_by: user?.id,
        });

      if (movementError) console.error('Error recording movement:', movementError);

      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, stock: newStock } : i
        )
      );

      toast.success('Stock actualizado');
      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Error al actualizar stock');
      return false;
    }
  }, [items, user?.id]);

  // Calculate margin
  const getMargin = useCallback((item: SellerCatalogItem) => {
    if (item.precioCosto === 0) return 0;
    return ((item.precioVenta - item.precioCosto) / item.precioCosto) * 100;
  }, []);

  // Get statistics
  const getStats = useCallback(() => {
    const totalProducts = items.length;
    const activeProducts = items.filter(i => i.isActive).length;
    const totalStock = items.reduce((sum, i) => sum + i.stock, 0);
    const totalValue = items.reduce((sum, i) => sum + (i.stock * i.precioVenta), 0);
    const avgMargin = items.length > 0
      ? items.reduce((sum, i) => sum + getMargin(i), 0) / items.length
      : 0;

    return {
      totalProducts,
      activeProducts,
      totalStock,
      totalValue,
      avgMargin,
    };
  }, [items, getMargin]);

  return {
    items,
    isLoading,
    storeId,
    updatePrecioVenta,
    toggleActive,
    updateStock,
    getMargin,
    getStats,
    refetch: fetchCatalog,
  };
};
