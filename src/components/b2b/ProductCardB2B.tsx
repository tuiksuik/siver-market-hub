import { useState } from 'react';
import { ShoppingCart, AlertCircle, Check } from 'lucide-react';
import { ProductB2BCard, CartItemB2B } from '@/types/b2b';

interface ProductCardB2BProps {
  product: ProductB2BCard;
  onAddToCart: (item: CartItemB2B) => void;
  cartItem?: CartItemB2B;
}

const ProductCardB2B = ({ product, onAddToCart, cartItem }: ProductCardB2BProps) => {
  const [cantidad, setCantidad] = useState(product.moq);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cantidad * product.precio_b2b;
  const isInvalid = cantidad < product.moq || cantidad > product.stock_fisico;
  const isOutOfStock = product.stock_fisico === 0;

  // Calcular descuentos según cantidad
  const getDiscount = () => {
    if (cantidad >= product.moq * 10) return 0.20; // 20% descuento
    if (cantidad >= product.moq * 5) return 0.15; // 15% descuento
    if (cantidad >= product.moq * 3) return 0.10; // 10% descuento
    if (cantidad >= product.moq * 2) return 0.05; // 5% descuento
    return 0;
  };

  const discountPercent = getDiscount();
  const discountedPrice = product.precio_b2b * (1 - discountPercent);
  const finalSubtotal = cantidad * discountedPrice;
  const savings = subtotal - finalSubtotal;

  const getStockStatus = () => {
    if (isOutOfStock) return 'Agotado';
    if (product.stock_fisico < product.moq * 2) return 'Stock bajo';
    return `${product.stock_fisico} unidades`;
  };

  const getStockColor = () => {
    if (isOutOfStock) return 'text-red-600 bg-red-50';
    if (product.stock_fisico < product.moq * 2) return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  const handleAddToCart = () => {
    setError(null);

    if (cantidad < product.moq) {
      setError(`MOQ mínimo: ${product.moq} unidades`);
      return;
    }

    if (cantidad > product.stock_fisico) {
      setError(`Stock disponible: ${product.stock_fisico} unidades`);
      return;
    }

    onAddToCart({
      productId: product.id,
      sku: product.sku,
      nombre: product.nombre,
      precio_b2b: product.precio_b2b,
      moq: product.moq,
      stock_fisico: product.stock_fisico,
      cantidad,
      subtotal,
    });

    // Reset cantidad a MOQ
    setCantidad(product.moq);
  };

  return (
    <div className={`bg-white rounded-lg border-2 overflow-hidden hover:shadow-xl transition ${
      cartItem ? 'border-green-500 shadow-lg' : 'border-gray-200'
    }`}>
      {/* Badge en carrito */}
      {cartItem && (
        <div className="absolute top-2 right-2 z-10 bg-green-500 text-white rounded-full p-2">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.imagen_principal}
          alt={product.nombre}
          className="w-full h-full object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded">Agotado</span>
          </div>
        )}
        
        {/* Descuento Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm">
            -{(discountPercent * 100).toFixed(0)}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* SKU */}
        <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>

        {/* Nombre */}
        <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2">
          {product.nombre}
        </h3>

        {/* Precios - Mejorado */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Precio Mayorista</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-blue-600">
              ${discountedPrice.toFixed(2)}
            </p>
            {discountPercent > 0 && (
              <p className="text-sm text-gray-500 line-through">
                ${product.precio_b2b.toFixed(2)}
              </p>
            )}
          </div>
          {discountPercent > 0 && (
            <p className="text-xs text-green-600 font-semibold mt-1">
              ¡Ahorras ${savings.toFixed(2)}!
            </p>
          )}
        </div>

        {/* MOQ y Stock */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 bg-amber-50 rounded border border-amber-200">
            <p className="text-xs text-gray-600">MOQ</p>
            <p className="text-lg font-bold text-amber-600">{product.moq}</p>
          </div>
          <div className={`p-2 rounded border ${getStockColor()} border-opacity-30`}>
            <p className="text-xs text-gray-600">Stock</p>
            <p className={`text-lg font-bold ${getStockColor()}`}>{getStockStatus()}</p>
          </div>
        </div>

        {/* Información de descuentos */}
        {!isOutOfStock && (
          <div className="mb-4 p-2 bg-indigo-50 rounded text-xs text-indigo-700 border border-indigo-200">
            <p className="font-semibold mb-1">Descuentos por volumen:</p>
            <div className="space-y-1 text-xs">
              <p>• {product.moq * 2}+ = 5% descuento</p>
              <p>• {product.moq * 3}+ = 10% descuento</p>
              <p>• {product.moq * 5}+ = 15% descuento</p>
              <p>• {product.moq * 10}+ = 20% descuento</p>
            </div>
          </div>
        )}

        {/* Campo de Cantidad */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Cantidad
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCantidad(Math.max(product.moq, cantidad - 1))}
              disabled={isOutOfStock}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              −
            </button>
            <input
              type="number"
              min={product.moq}
              max={product.stock_fisico}
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value) || product.moq)}
              disabled={isOutOfStock}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-center disabled:opacity-50"
            />
            <button
              onClick={() => setCantidad(Math.min(product.stock_fisico, cantidad + 1))}
              disabled={isOutOfStock}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="mb-4 p-2 bg-gray-50 rounded text-center border-2 border-gray-200">
          <p className="text-xs text-gray-600">Total por Compra</p>
          <p className="text-xl font-bold text-gray-900">${finalSubtotal.toFixed(2)}</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded flex gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Botón Agregar al Carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isInvalid}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCardB2B;
