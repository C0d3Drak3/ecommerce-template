'use client';
import { useState } from 'react';

interface SearchFiltersProps {
  onSearch: (filters: {
    searchTerm: string;
    category: string;
    tag: string;
  }) => void;
  categories: string[];
  tags: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, categories, tags }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      category: selectedCategory,
      tag: selectedTag,
    });
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Búsqueda por nombre */}
        <div className="flex flex-col">
          <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-700">
            Buscar por nombre
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nombre del producto..."
          />
        </div>

        {/* Selector de categoría */}
        <div className="flex flex-col">
          <label htmlFor="category" className="mb-2 text-sm font-medium text-gray-700">
            Categoría
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Selector de tags */}
        <div className="flex flex-col">
          <label htmlFor="tag" className="mb-2 text-sm font-medium text-gray-700">
            Tag
          </label>
          <select
            id="tag"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Botón de búsqueda */}
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
