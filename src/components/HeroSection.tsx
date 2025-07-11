'use client';

import { motion } from 'framer-motion';
import SearchFilters from './SearchFilters';

interface HeroSectionProps {
  onSearch: (searchTerm: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {

  return (
    <div className="relative text-white py-20 md:py-32 px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50">
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      <div className="relative max-w-4xl mx-auto text-center z-20">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Encuentra Tu Próximo Gadget Favorito
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explora nuestra colección curada de los mejores productos tecnológicos del mercado. Calidad, innovación y los mejores precios, todo en un solo lugar.
        </motion.p>
        
        <div className="max-w-2xl mx-auto mb-10">
          <SearchFilters onSearch={onSearch} />
        </div>

      </div>
    </div>
  );
};

export default HeroSection;
