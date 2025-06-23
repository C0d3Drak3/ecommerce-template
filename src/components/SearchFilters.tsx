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
  const [isFocused, setIsFocused] = useState(false);

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
      <form onSubmit={handleSearch} className="relative">
        <motion.div 
          className="relative"
          initial={false}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 20
          }}
        >
          <AnimatePresence>
            {isFocused && (
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0"
                style={{
                  filter: 'blur(12px)',
                  zIndex: -1
                }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 0.8, scale: 1.03 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.4,
                  ease: 'easeInOut'
                }}
              />
            )}
          </AnimatePresence>
          
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full p-4 pl-12 pr-20 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 z-10"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-20">
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              animate={{
                scale: isFocused ? 1.2 : 1,
                rotate: isFocused ? [0, 10, -10, 0] : 0,
              }}
              transition={{
                scale: { duration: 0.2 },
                rotate: { duration: 0.4 }
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </motion.svg>
          </div>
          <AnimatePresence>
            {searchTerm && (
              <motion.button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                aria-label="Limpiar búsqueda"
                initial={{ opacity: 0, x: 10, y: -10 }}
                animate={{ opacity: 1, x: -5, y: -10 }}
                exit={{ opacity: 0, x: 10, y: -10 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            type="submit"
            className="absolute top-0 h-full px-4 bg-blue-600 text-white rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 z-20 flex items-center justify-center"
            style={{ 
              top: 'calc(50% - 29px)',
              right: '-4px'
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Buscar
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

export default SearchFilters;
