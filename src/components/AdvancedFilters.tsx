'use client';

import { useState, useEffect } from 'react';

interface AdvancedFiltersProps {
  categories: string[];
  tags: string[];
  onFilterChange: (filters: {
    minPrice: number;
    maxPrice: number;
    selectedCategories: string[];
    selectedTags: string[];
    onlyDiscounted: boolean;
  }) => void;
  maxPrice: number;
}

const MAX_PRICE_LIMIT = 2000; // Precio máximo permitido

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  categories, 
  tags, 
  onFilterChange,
  maxPrice 
}) => {
  // Asegurarse de que el precio máximo no exceda el límite
  const safeMaxPrice = Math.min(maxPrice, MAX_PRICE_LIMIT);
  const [priceRange, setPriceRange] = useState({ min: 0, max: safeMaxPrice });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  // Actualizar el rango máximo cuando cambia la prop
  useEffect(() => {
    setPriceRange(prev => {
      const newMax = Math.min(Math.max(prev.max, maxPrice), MAX_PRICE_LIMIT);
      return {
        ...prev,
        max: newMax,
        // Asegurar que el mínimo no sea mayor que el máximo
        min: Math.min(prev.min, newMax)
      };
    });
  }, [maxPrice]);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    onFilterChange({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      selectedCategories,
      selectedTags,
      onlyDiscounted
    });
  }, [priceRange, selectedCategories, selectedTags, onlyDiscounted, onFilterChange]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="w-64 p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <span className="text-purple-500 mr-2">⚙️</span> Filtros Avanzados
      </h3>
      
      {/* Rango de precios */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Rango de precios</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>${priceRange.min.toFixed(2)}</span>
            <span>${priceRange.max.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={safeMaxPrice}
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max) }))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max={safeMaxPrice}
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min) }))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Categorías</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-gray-700 dark:text-gray-300">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Etiquetas */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Etiquetas</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {tags.map(tag => (
            <label key={tag} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
                className="rounded text-blue-600"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Solo con descuento */}
      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <label className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={onlyDiscounted}
            onChange={(e) => setOnlyDiscounted(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <span className="font-medium text-gray-800 dark:text-gray-200">Mostrar solo ofertas</span>
        </label>
      </div>
    </div>
  );
};

export default AdvancedFilters;
