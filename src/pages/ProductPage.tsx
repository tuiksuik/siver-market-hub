import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Heart } from "lucide-react";
import { useState } from "react";

const ProductPage = () => {
  const { sku } = useParams<{ sku: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Imágenes del producto */}
          <div>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center mb-4">
              <p className="text-gray-500">Imagen del producto</p>
            </div>
          </div>

          {/* Información del producto */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Nombre del Producto
                </h1>
                <p className="text-sm text-gray-600">SKU: {sku}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            {/* Precio */}
            <div className="mb-6">
              <div className="text-3xl font-bold text-red-500 mb-2">
                $XX.XX
              </div>
              <p className="text-sm text-gray-600">Precio minorista</p>
            </div>

            {/* Stock */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-900">
                Stock disponible: 50 unidades
              </p>
            </div>

            {/* Cantidad */}
            <div className="flex items-center gap-4 mb-6">
              <label className="text-sm font-medium">Cantidad:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border-l border-r border-gray-300 py-2"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4">
              <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition">
                Agregar al Carrito
              </button>
              <button className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-lg font-medium transition">
                Comprar Ahora
              </button>
            </div>

            {/* Descripción */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">Descripción del Producto</h2>
              <p className="text-gray-700 leading-relaxed">
                Aquí iría la descripción detallada del producto...
              </p>
            </div>
          </div>
        </div>

        {/* Otros vendedores */}
        <div className="mt-12 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Otros vendedores que ofrecen este producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lista de otros vendedores */}
            <p className="text-gray-500">Cargando otros vendedores...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
