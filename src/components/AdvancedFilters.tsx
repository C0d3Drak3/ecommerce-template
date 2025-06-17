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
    <div className="w-64 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filtros Avanzados</h3>
      
      {/* Rango de precios */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Rango de precios</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange.min.toFixed(2)}</span>
            <span>${priceRange.max.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={safeMaxPrice}
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Math.min(Number(e.target.value), prev.max) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <input
            type="range"
            min="0"
            max={safeMaxPrice}
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Math.max(Number(e.target.value), prev.min) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Categorías</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {categories.map(category => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="rounded text-blue-600"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Etiquetas */}
      <div className="mb-6">
        <h4 className="font-medium mb-2">Etiquetas</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
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
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={onlyDiscounted}
            onChange={(e) => setOnlyDiscounted(e.target.checked)}
            className="rounded text-blue-600"
          />
          <span>Mostrar solo ofertas</span>
        </label>
      </div>
    </div>
  );
};

export default AdvancedFilters;
