import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  badge?: string;
}

interface ProductCarouselProps {
  title: string;
  products: Product[];
  itemsPerView?: number;
}

const ProductCarousel = ({
  title,
  products,
  itemsPerView = 5,
}: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(
        Math.min(products.length - itemsPerView, currentIndex + 1)
      );
    }
  };

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <a href="#" className="text-red-500 hover:text-red-600 font-medium">
          Ver Todo →
        </a>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {currentIndex > 0 && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 overflow-hidden">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Right Arrow */}
        {currentIndex < products.length - itemsPerView && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>
    </section>
  );
};

export default ProductCarousel;