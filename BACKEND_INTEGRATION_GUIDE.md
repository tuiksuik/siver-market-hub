#!/bin/bash
# BACKEND INTEGRATION GUIDE
# Instrucciones para integrar el frontend con el backend de Supabase

cat << 'EOF'

╔════════════════════════════════════════════════════════════════════════════╗
║              GUÍA DE INTEGRACIÓN BACKEND - B2B SELLER INTERFACE            ║
╚════════════════════════════════════════════════════════════════════════════╝

## 1. CREAR TABLA `orders_b2b` EN SUPABASE

### 1.1 SQL Script
Ejecuta esto en Supabase → SQL Editor:

```sql
-- Crear tabla de órdenes B2B
CREATE TABLE orders_b2b (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Datos del pedido
  items JSONB NOT NULL, -- Estructura: CartItemB2B[]
  subtotal DECIMAL(12,2) NOT NULL,
  tax DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  
  -- Método y estado de pago
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'moncash', 'transfer')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Estado del pedido
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  
  -- Notas y tracking
  notes TEXT,
  tracking_number TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_orders_seller_id ON orders_b2b(seller_id);
CREATE INDEX idx_orders_created_at ON orders_b2b(created_at);
CREATE INDEX idx_orders_status ON orders_b2b(order_status);
CREATE INDEX idx_orders_payment_status ON orders_b2b(payment_status);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_orders_b2b_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER orders_b2b_updated_at_trigger
BEFORE UPDATE ON orders_b2b
FOR EACH ROW
EXECUTE FUNCTION update_orders_b2b_updated_at();

-- Tabla de pagos (para tracking detallado)
CREATE TABLE payments_b2b (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders_b2b(id) ON DELETE CASCADE,
  
  method TEXT NOT NULL CHECK (method IN ('stripe', 'moncash', 'transfer')),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Referencias de pago externo
  stripe_charge_id TEXT,
  moncash_transaction_id TEXT,
  transfer_confirmation TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments_b2b(order_id);
CREATE INDEX idx_payments_status ON payments_b2b(status);
```

### 1.2 Verificar tabla
```sql
-- Ver estructura
\d orders_b2b;

-- Ver datos
SELECT * FROM orders_b2b LIMIT 5;
```

---

## 2. CONFIGURAR ROW LEVEL SECURITY (RLS)

### 2.1 Enable RLS en tabla orders_b2b
```sql
-- Activar RLS
ALTER TABLE orders_b2b ENABLE ROW LEVEL SECURITY;

-- Sellers solo ven sus propias órdenes
CREATE POLICY seller_see_own_orders ON orders_b2b
  FOR SELECT
  USING (seller_id = auth.uid());

-- Sellers solo pueden crear sus propias órdenes
CREATE POLICY seller_create_own_orders ON orders_b2b
  FOR INSERT
  WITH CHECK (seller_id = auth.uid());

-- Admin ve todo
CREATE POLICY admin_see_all_orders ON orders_b2b
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Sellers solo actualizan (notas)
CREATE POLICY seller_update_own_orders ON orders_b2b
  FOR UPDATE
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());
```

### 2.2 Enable RLS en tabla payments_b2b
```sql
ALTER TABLE payments_b2b ENABLE ROW LEVEL SECURITY;

CREATE POLICY seller_see_own_payments ON payments_b2b
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders_b2b
      WHERE orders_b2b.id = payments_b2b.order_id
      AND orders_b2b.seller_id = auth.uid()
    )
  );

CREATE POLICY admin_see_all_payments ON payments_b2b
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
```

---

## 3. ACTUALIZAR `services/api/products.ts` PARA SUPORTAR FETCH REAL

### 3.1 Cambiar mock data en SellerAcquisicionLotes.tsx

**ACTUAL** (Mock):
```tsx
const mockProducts: ProductB2BCard[] = [
  { id: '1', sku: 'TSHIRT-001', ... },
  ...
];
setProducts(mockProducts);
```

**DEBERÍA SER**:
```tsx
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, sku, nombre, precio_b2b, moq, stock_fisico, imagen_principal, categoria_id')
        .eq('visible', true)
        .gt('stock_fisico', -1); // Incluir agotados
      
      if (error) throw error;
      setProducts(data as ProductB2BCard[]);
    } catch (err) {
      console.error('Error fetching B2B products:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    }
  };
  
  fetchProducts();
}, []);
```

### 3.2 Crear endpoint API para crear órdenes

**Archivo**: `src/services/api/orders.ts`

```typescript
import { supabase } from '@/integrations/supabase/client';
import { CartB2B, OrderB2B } from '@/types/b2b';

export const createB2BOrder = async (
  sellerId: string,
  cart: CartB2B,
  paymentMethod: 'stripe' | 'moncash' | 'transfer'
): Promise<{ orderId: string; error?: Error }> => {
  try {
    // Validar que todas las cantidades siguen siendo válidas
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, moq, stock_fisico')
      .in('id', cart.items.map(item => item.productId));
    
    if (fetchError) throw fetchError;
    
    // Validar cada item
    for (const item of cart.items) {
      const product = products?.find(p => p.id === item.productId);
      if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
      if (item.cantidad < product.moq) {
        throw new Error(`${item.nombre}: cantidad debajo del MOQ`);
      }
      if (item.cantidad > product.stock_fisico) {
        throw new Error(`${item.nombre}: stock insuficiente`);
      }
    }
    
    // Crear la orden
    const orderData: Partial<OrderB2B> = {
      seller_id: sellerId,
      items: cart.items,
      subtotal: cart.subtotal,
      tax: 0, // Implementar después
      total: cart.subtotal,
      payment_method: paymentMethod,
      status: 'pending'
    };
    
    const { data, error: insertError } = await supabase
      .from('orders_b2b')
      .insert([orderData])
      .select('id')
      .single();
    
    if (insertError) throw insertError;
    
    // Reducir stock de productos
    for (const item of cart.items) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_fisico: supabase.rpc('subtract_stock', {
          product_id: item.productId,
          quantity: item.cantidad
        })})
        .eq('id', item.productId);
      
      if (updateError) console.warn('Warning updating stock:', updateError);
    }
    
    // Crear registro de pago
    await supabase
      .from('payments_b2b')
      .insert([{
        order_id: data.id,
        method: paymentMethod,
        amount: cart.subtotal,
        status: 'pending'
      }]);
    
    return { orderId: data.id };
    
  } catch (error) {
    console.error('Error creating B2B order:', error);
    return {
      orderId: '',
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
};

export const getSellerOrders = async (sellerId: string) => {
  try {
    const { data, error } = await supabase
      .from('orders_b2b')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { orders: data, error: null };
  } catch (error) {
    return { orders: null, error };
  }
};
```

### 3.3 Actualizar SellerCheckout.tsx para usar la API

```tsx
const handlePlaceOrder = async () => {
  setIsProcessing(true);
  
  try {
    const { orderId, error } = await createB2BOrder(
      user?.id || '',
      cart,
      paymentMethod as 'stripe' | 'moncash' | 'transfer'
    );
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }
    
    // Log de éxito
    console.log('Order created:', orderId);
    
    // Limpiar carrito
    clearCart();
    
    // Mostrar confirmación
    setOrderPlaced(true);
    setIsProcessing(false);
    
    // (Opcional) Redirigir a página de seguimiento
    // navigate(`/seller/ordenes/${orderId}`);
    
  } catch (error) {
    console.error('Error:', error);
    toast({
      title: "Error",
      description: "Hubo un problema al procesar tu pedido",
      variant: "destructive"
    });
    setIsProcessing(false);
  }
};
```

---

## 4. CREAR FUNCTION PARA RESTAR STOCK AUTOMÁTICAMENTE

### 4.1 PostgreSQL Function

```sql
CREATE OR REPLACE FUNCTION subtract_stock(
  p_product_id UUID,
  p_quantity INT
)
RETURNS INT AS $$
DECLARE
  v_new_stock INT;
BEGIN
  UPDATE products
  SET stock_fisico = stock_fisico - p_quantity
  WHERE id = p_product_id
  RETURNING stock_fisico INTO v_new_stock;
  
  RETURN v_new_stock;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. CREAR PÁGINA DE HISTORIAL DE ÓRDENES

### 5.1 Archivo: `src/pages/seller/SellerOrdenes.tsx`

```tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getSellerOrders } from '@/services/api/orders';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Package } from 'lucide-react';

interface OrderWithDetails {
  id: string;
  created_at: string;
  subtotal: number;
  total: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  items: any[];
}

const SellerOrdenes = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      
      const { orders: data } = await getSellerOrders(user.id);
      setOrders(data || []);
      setIsLoading(false);
    };
    
    loadOrders();
  }, [user?.id]);
  
  if (isLoading) {
    return <div className="text-center py-8">Cargando órdenes...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Órdenes</h1>
        
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No tienes órdenes aún</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">Orden: {order.id.slice(0, 8)}...</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString('es-HT')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                    <Badge>{order.order_status}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span>{order.items.length} productos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{order.payment_method}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <Badge variant="outline">{order.payment_status}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SellerOrdenes;
```

---

## 6. AÑADIR RUTAS EN App.tsx

```tsx
import SellerOrdenes from "./pages/seller/SellerOrdenes";

// En las SELLER ROUTES:
<Route 
  path="/seller/ordenes" 
  element={
    <ProtectedRoute requiredRoles={[UserRole.SELLER]}>
      <SellerOrdenes />
    </ProtectedRoute>
  } 
/>
```

---

## 7. IMPLEMENTAR NOTIFICACIONES POR EMAIL

### 7.1 Usar Supabase Notifications o SendGrid

**Opción A - Supabase Realtime:**
Escuchar cambios en tabla orders_b2b y enviar email

**Opción B - SendGrid:**
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: sellerEmail,
  from: 'noreply@siver.market',
  subject: 'Pedido Confirmado',
  html: `
    <h2>¡Pedido Confirmado!</h2>
    <p>Tu pedido #${orderId} ha sido creado.</p>
    <p>Total: $${total}</p>
  `
};

await sgMail.send(msg);
```

---

## 8. IMPLEMENTAR PAGOS

### 8.1 Stripe Integration

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 8.2 Crear componente StripeCheckout

```tsx
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Usar en SellerCheckout cuando paymentMethod === 'stripe'
```

---

## 9. VARIABLE DE ENTORNO NUEVA

Añadir a `.env.local`:
```
VITE_SENDGRID_API_KEY=sg_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_MONCASH_API_KEY=...
```

---

## 10. CHECKLIST FINAL

- [ ] Tabla `orders_b2b` creada
- [ ] Tabla `payments_b2b` creada
- [ ] RLS policies aplicadas
- [ ] Function `subtract_stock` creada
- [ ] Fetch real de productos implementado
- [ ] API `createB2BOrder` funcional
- [ ] SellerCheckout conectado a API
- [ ] Página de órdenes creada
- [ ] Email de confirmación enviado
- [ ] Pagos integrados (Stripe/MonCash)
- [ ] Testing de flujo completo exitoso

---

## FLUJO BACKEND SIMPLIFICADO

```
User Click "Confirmar Pedido"
    ↓
SellerCheckout.handlePlaceOrder()
    ↓
createB2BOrder(sellerId, cart, paymentMethod)
    ├─ Validar stock de cada item
    ├─ Insertar en tabla orders_b2b
    ├─ Insertar en tabla payments_b2b
    ├─ UPDATE stock en products
    └─ Retornar orderId
    ↓
Toast éxito + Mostrar pantalla confirmación
    ↓
clearCart() + Redirect a /seller/adquisicion-lotes
    ↓
(Background) Enviar email de confirmación
```

---

**Última actualización**: Diciembre 11, 2024
**Próximo paso**: Implementar tabla orders_b2b en Supabase

EOF
