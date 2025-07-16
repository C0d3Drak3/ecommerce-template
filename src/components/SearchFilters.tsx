'use client';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(searchTerm);
    }
  }, [searchTerm, onSearch]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 md:gap-0 w-full">
        <div className="relative w-full">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-4 pl-12 pr-12 text-gray-700 bg-white border border-gray-300 rounded-full md:rounded-r-none shadow-sm focus:outline-none focus:shadow-neon-xl focus:border-transparent transition-all"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 -mt-[9px] text-gray-400 hover:text-gray-600 z-10"
                aria-label="Limpiar búsqueda"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          type="submit"
          className="w-full md:w-auto flex-shrink-0 px-6 py-4 bg-blue-600 text-white rounded-full md:rounded-l-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Buscar
        </motion.button>
      </form>
    </div>
  );
};

export default SearchFilters;
