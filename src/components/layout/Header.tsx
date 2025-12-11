import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Search, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { label: "Solo para ti", href: "#" },
    { label: "Novedades", href: "#" },
    { label: "Ofertas", href: "#" },
    { label: "Ropa de mujer", href: "#" },
    { label: "Curvy", href: "#" },
    { label: "Niños", href: "#" },
    { label: "Ropa para hombre", href: "#" },
    { label: "Ropa interior", href: "#" },
    { label: "Accesorios", href: "#" },
    { label: "Zapatos", href: "#" },
    { label: "Hogar y Vida", href: "#" },
    { label: "Belleza y Salud", href: "#" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>Envío desde el extranjero</span>
              <span>•</span>
              <span>Devolución Gratis</span>
            </div>
            <div className="flex items-center gap-4">
              <button>Centro de Ayuda</button>
              <span>•</span>
              <Link to="/admin/login">Vender</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded bg-red-500 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">SIVER</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 mx-8 max-w-md">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-red-500 transition">
              <Heart className="w-6 h-6" />
              <span className="text-xs">Favoritos</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-red-500 transition">
              <User className="w-6 h-6" />
              <span className="text-xs">Cuenta</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-red-500 transition">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-xs">Carrito</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Categories Bar */}
        <div className="hidden lg:flex items-center overflow-x-auto gap-0 border-t border-gray-200 h-12">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              to={cat.href}
              className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-500 hover:bg-gray-50 border-b-2 border-transparent hover:border-red-500 transition whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Input
              type="text"
              placeholder="Buscar..."
              className="w-full mb-4 rounded-full"
            />
            <nav className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  to={cat.href}
                  className="py-2 px-4 hover:bg-gray-50 rounded text-gray-700"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;