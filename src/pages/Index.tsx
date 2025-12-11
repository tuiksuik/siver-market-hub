import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProductCarousel from "@/components/landing/ProductCarousel";
import ProductGrid from "@/components/landing/ProductGrid";
import CategoryGrid from "@/components/landing/CategoryGrid";

const Index = () => {
  // Datos de ejemplo - En la práctica, estos vendrían de tu base de datos
  const mockProducts = [
    {
      id: "1",
      name: "Blusa Elegante de Verano",
      price: 25.99,
      originalPrice: 45.99,
      image:
        "https://images.unsplash.com/photo-1595777707802-a89fbc6ce338?w=300&h=400&fit=crop",
      badge: "TENDENCIA",
    },
    {
      id: "2",
      name: "Vestido Casual Cómodo",
      price: 34.99,
      originalPrice: 59.99,
      image:
        "https://images.unsplash.com/photo-1598888141096-94f9017f3a3c?w=300&h=400&fit=crop",
    },
    {
      id: "3",
      name: "Pantalón Vaquero Premium",
      price: 39.99,
      originalPrice: 69.99,
      image:
        "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=300&h=400&fit=crop",
    },
    {
      id: "4",
      name: "Chaqueta de Cuero",
      price: 64.99,
      originalPrice: 129.99,
      image:
        "https://images.unsplash.com/photo-1591047990508-ea37cff4565d?w=300&h=400&fit=crop",
      badge: "VENTA FLASH",
    },
    {
      id: "5",
      name: "Zapatillas Deportivas",
      price: 44.99,
      originalPrice: 89.99,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop",
    },
    {
      id: "6",
      name: "Accesorios de Moda",
      price: 15.99,
      originalPrice: 29.99,
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=400&fit=crop",
    },
    {
      id: "7",
      name: "Bolsa de Mano Moderna",
      price: 49.99,
      originalPrice: 99.99,
      image:
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=400&fit=crop",
    },
    {
      id: "8",
      name: "Sombrilla Elegante",
      price: 18.99,
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
      discount: 40,
    },
    {
      id: "9",
      name: "Anillo de Plata",
      price: 22.99,
      originalPrice: 45.99,
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=400&fit=crop",
    },
    {
      id: "10",
      name: "Collar Dorado Vintage",
      price: 32.99,
      originalPrice: 65.99,
      image:
        "https://images.unsplash.com/photo-1535562141207-4b100cb4cb12?w=300&h=400&fit=crop",
    },
  ];

  const mockCategories = [
    { id: "c1", label: "Mujer", image: "https://images.unsplash.com/photo-1542060745-6b3bf4a5f5e6?w=400&h=400&fit=crop" },
    { id: "c2", label: "Curvy", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop" },
    { id: "c3", label: "Niños", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
    { id: "c4", label: "Hombre", image: "https://images.unsplash.com/photo-1546519638-68f5e0d1f7a3?w=400&h=400&fit=crop" },
    { id: "c5", label: "Sweaters", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop" },
    { id: "c6", label: "Celulares y Accs", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop" },
    { id: "c7", label: "Joyería y accs", image: "https://images.unsplash.com/photo-1520975916034-0b3b2b4b8f95?w=400&h=400&fit=crop" },
    { id: "c8", label: "Tops", image: "https://images.unsplash.com/photo-1495121605193-b116b5b09bb9?w=400&h=400&fit=crop" },
    { id: "c9", label: "Hogar y Vida", image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop" },
    { id: "c10", label: "Belleza y salud", image: "https://images.unsplash.com/photo-1581579185225-5f8a2c0b3f3f?w=400&h=400&fit=crop" },
    { id: "c11", label: "Zapatos", image: "https://images.unsplash.com/photo-1528701800489-476f4c5acb9b?w=400&h=400&fit=crop" },
    { id: "c12", label: "Deportes y Aire Libre", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop" },
    { id: "c13", label: "Automotriz", image: "https://images.unsplash.com/photo-1511915426328-7f6c0f3b4f6f?w=400&h=400&fit=crop" },
    { id: "c14", label: "Mezclilla", image: "https://images.unsplash.com/photo-1514995669114-0a6c3c7d3b35?w=400&h=400&fit=crop" },
    { id: "c15", label: "Ropa Interior y Pijamas", image: "https://images.unsplash.com/photo-1562158070-4a5b9d4d9d2e?w=400&h=400&fit=crop" },
    { id: "c16", label: "Bebé y maternidad", image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=400&h=400&fit=crop" },
    { id: "c17", label: "Vestidos", image: "https://images.unsplash.com/photo-1520975916034-0b3b2b4b8f95?w=400&h=400&fit=crop" },
    { id: "c18", label: "Bottoms", image: "https://images.unsplash.com/photo-1533151235564-7e0b1af0c5d8?w=400&h=400&fit=crop" },
    { id: "c19", label: "Abrigos y Trajes", image: "https://images.unsplash.com/photo-1520975916034-0b3b2b4b8f95?w=400&h=400&fit=crop" },
    { id: "c20", label: "Bolsas y Equipaje", image: "https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=400&h=400&fit=crop" },
    { id: "c21", label: "Útiles escolares y de oficina", image: "https://images.unsplash.com/photo-1553729784-e91953dec042?w=400&h=400&fit=crop" },
    { id: "c22", label: "Juguetes y juegos", image: "https://images.unsplash.com/photo-1601758123927-6a8f8b4f3d1d?w=400&h=400&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        {/* Categories grid like Shein */}
        <CategoryGrid categories={mockCategories} />

        {/* Super Rebajas */}
        <ProductCarousel
          title="🔥 SÚPER REBAJAS"
          products={mockProducts}
          itemsPerView={5}
        />

        {/* Lo Más Nuevo */}
        <ProductCarousel
          title="⭐ LO MÁS NUEVO"
          products={mockProducts}
          itemsPerView={5}
        />

        {/* Top Ventas */}
        <ProductCarousel
          title="👑 TOP VENTAS"
          products={mockProducts}
          itemsPerView={5}
        />

        {/* Ropa de Mujer */}
        <ProductGrid
          title="ROPA DE MUJER"
          subtitle="Descubre nuestras mejores prendas para ti"
          products={mockProducts}
        />

        {/* Accesorios */}
        <ProductGrid
          title="ACCESORIOS"
          subtitle="Completa tu look con nuestros accesorios"
          products={mockProducts}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Index;