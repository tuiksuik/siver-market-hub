import { useState } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { ProductB2BCard, CartItemB2B } from '@/types/b2b';

interface ProductCardB2BProps {
  product: ProductB2BCard;
  onAddToCart: (item: CartItemB2B) => void;
}

const ProductCardB2B = ({ product, onAddToCart }: ProductCardB2BProps) => {
  const [cantidad, setCantidad] = useState(product.moq);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cantidad * product.precio_b2b;
  const isInvalid = cantidad < product.moq || cantidad > product.stock_fisico;
  const isOutOfStock = product.stock_fisico === 0;

  const getStockStatus = () => {
    if (isOutOfStock) return 'Agotado';
    if (product.stock_fisico < product.moq * 2) return 'Stock bajo';
    return `${product.stock_fisico} unidades`;
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition">
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
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* SKU */}
        <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>

        {/* Nombre */}
        <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2">
          {product.nombre}
        </h3>

        {/* Precio Mayorista - DESTACADO */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Precio Mayorista</p>
          <p className="text-2xl font-bold text-blue-600">
            ${product.precio_b2b.toFixed(2)}
          </p>
        </div>

        {/* MOQ y Stock */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-2 bg-amber-50 rounded">
            <p className="text-xs text-gray-600">MOQ</p>
            <p className="text-lg font-bold text-amber-600">{product.moq}</p>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <p className="text-xs text-gray-600">Stock</p>
            <p className="text-lg font-bold text-green-600">{getStockStatus()}</p>
          </div>
        </div>

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
        <div className="mb-4 p-2 bg-gray-50 rounded text-center">
          <p className="text-xs text-gray-600">Subtotal</p>
          <p className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</p>
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
