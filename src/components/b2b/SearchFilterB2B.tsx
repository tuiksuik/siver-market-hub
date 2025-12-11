import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { B2BFilters } from '@/types/b2b';

interface SearchFilterB2BProps {
  filters: B2BFilters;
  onFiltersChange: (filters: B2BFilters) => void;
  categories: Array<{ id: string; nombre: string }>;
}

const SearchFilterB2B = ({ filters, onFiltersChange, categories }: SearchFilterB2BProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = filters.searchQuery || filters.category || filters.stockStatus !== 'all';

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      category: null,
      stockStatus: 'all',
      sortBy: 'newest',
    });
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold">Buscar y Filtrar</h2>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
              Activos
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda por SKU o Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por SKU o Nombre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ej: SKU-001"
              value={filters.searchQuery}
              onChange={(e) =>
                onFiltersChange({ ...filters, searchQuery: e.target.value })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría ({categories.length})
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                category: e.target.value || null,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Estatus de Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Disponibilidad
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                stockStatus: e.target.value as B2BFilters['stockStatus'],
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="all">Todos</option>
            <option value="in_stock">En Stock</option>
            <option value="low_stock">Stock Bajo</option>
            <option value="out_of_stock">Agotado</option>
          </select>
        </div>

        {/* Ordenar Por */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                sortBy: e.target.value as B2BFilters['sortBy'],
              })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="newest">Más Nuevo</option>
            <option value="price_asc">Precio ↑ (Menor a Mayor)</option>
            <option value="price_desc">Precio ↓ (Mayor a Menor)</option>
            <option value="moq_asc">MOQ ↑ (Menor cantidad)</option>
            <option value="moq_desc">MOQ ↓ (Mayor cantidad)</option>
          </select>
        </div>
      </div>

      {/* Botón Filtros Avanzados */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
      >
        <Filter className="w-4 h-4" />
        {showAdvanced ? 'Ocultar' : 'Mostrar'} filtros avanzados
      </button>

      {/* Filtros Avanzados */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="font-semibold text-sm text-indigo-900 mb-2">💡 Consejos de Búsqueda</h3>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• Usa el nombre o SKU para buscar productos específicos</li>
                <li>• Filtra por categoría para ver opciones relacionadas</li>
                <li>• Verifica stock antes de añadir al carrito</li>
                <li>• Los descuentos se aplican automáticamente según cantidad</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-sm text-green-900 mb-2">🎯 Beneficios Mayorista</h3>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• MOQ: Cantidad mínima de orden</li>
                <li>• Descuentos progresivos por volumen</li>
                <li>• Precios especiales B2B</li>
                <li>• Stock garantizado para mayoristas</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterB2B;
