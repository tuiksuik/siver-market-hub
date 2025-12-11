import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCartB2B } from '@/hooks/useCartB2B';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerCheckout = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { cart, clearCart } = useCartB2B();
  
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (cart.totalItems === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Carrito Vacío
              </h1>
              <p className="text-gray-600 mb-8">
                No tienes productos en tu carrito. Vuelve al catálogo para continuar comprando.
              </p>
              <Link to="/seller/adquisicion-lotes">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-gray-600 mb-8">
                Tu pedido ha sido creado exitosamente. Recibirás un correo de confirmación pronto.
              </p>
              <Link to="/seller/adquisicion-lotes">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulación del procesamiento
    setTimeout(() => {
      console.log('Pedido realizado:', {
        seller_id: user?.id,
        items: cart.items,
        subtotal: cart.subtotal,
        payment_method: paymentMethod,
        created_at: new Date().toISOString(),
      });
      
      clearCart();
      setOrderPlaced(true);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            to="/seller/adquisicion-lotes"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Catálogo
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout B2B</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumen del Pedido */}
          <div className="lg:col-span-2">
            {/* Información del Vendedor */}
            <Card className="mb-8 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Información del Vendedor
              </h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-semibold text-gray-900">Nombre:</span> {user?.name}</p>
                <p><span className="font-semibold text-gray-900">Email:</span> {user?.email}</p>
              </div>
            </Card>

            {/* Productos en el Pedido */}
            <Card className="mb-8 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Productos ({cart.items.length})
              </h2>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                      <span className="text-xs">Imagen</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.nombre}</p>
                      <p className="text-sm text-gray-500 mb-2">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">
                        {item.cantidad} unidades × ${item.precio_b2b.toFixed(2)} = ${item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Método de Pago */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Método de Pago
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setPaymentMethod('stripe')}>
                  <input
                    type="radio"
                    id="stripe"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="stripe" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Tarjeta de Crédito (Stripe)</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setPaymentMethod('moncash')}>
                  <input
                    type="radio"
                    id="moncash"
                    name="payment"
                    value="moncash"
                    checked={paymentMethod === 'moncash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="moncash" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">MonCash</p>
                    <p className="text-sm text-gray-500">Billetera digital haitiana</p>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setPaymentMethod('transfer')}>
                  <input
                    type="radio"
                    id="transfer"
                    name="payment"
                    value="transfer"
                    checked={paymentMethod === 'transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="transfer" className="flex-1 cursor-pointer">
                    <p className="font-semibold text-gray-900">Transferencia Bancaria</p>
                    <p className="text-sm text-gray-500">Transferencia directa a nuestra cuenta</p>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Resumen de Totales */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Unidades:</span>
                  <span className="font-semibold">{cart.totalQuantity}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total:</span>
                <span className="text-green-600">${cart.subtotal.toFixed(2)}</span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing || cart.totalItems === 0}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  'Confirmar Pedido'
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Al confirmar, aceptas los términos de servicio
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerCheckout;
