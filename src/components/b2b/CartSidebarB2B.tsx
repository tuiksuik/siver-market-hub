import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { CartB2B, CartItemB2B } from '@/types/b2b';
import { Link } from 'react-router-dom';

interface CartSidebarB2BProps {
  cart: CartB2B;
  onUpdateQuantity: (productId: string, cantidad: number) => void;
  onRemoveItem: (productId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CartSidebarB2B = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  isOpen,
  onToggle,
}: CartSidebarB2BProps) => {
  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {cart.totalItems}
        </span>
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={onToggle} />
      )}

      <div
        className={`fixed right-0 top-0 h-screen w-96 bg-white shadow-xl z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-blue-600 text-white p-4 flex items-center justify-between">
          <h2 className="font-bold text-lg">Carrito B2B</h2>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-blue-700 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {item.nombre}
                        </p>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.productId)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Cantidad */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            Math.max(item.moq, item.cantidad - 1)
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={item.moq}
                        max={item.stock_fisico}
                        value={item.cantidad}
                        onChange={(e) =>
                          onUpdateQuantity(
                            item.productId,
                            parseInt(e.target.value) || item.moq
                          )
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                      />
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            Math.min(item.stock_fisico, item.cantidad + 1)
                          )
                        }
                        className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Precio y Subtotal */}
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        ${item.precio_b2b.toFixed(2)} x {item.cantidad}
                      </span>
                      <span className="font-bold text-blue-600">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total de Unidades:</span>
                  <span className="font-medium">{cart.totalQuantity}</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-gray-50 p-3 rounded">
                  <span>Subtotal:</span>
                  <span className="text-blue-600">
                    ${cart.subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botón Checkout */}
              <Link
                to="/seller/checkout"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium text-center transition block mt-4"
              >
                Proceder al Checkout
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebarB2B;
