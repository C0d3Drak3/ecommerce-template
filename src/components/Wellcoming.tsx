'use client';
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import CardContainer from "./CardContainer";

// Animación de entrada para las secciones
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string; // Añadido para consistencia
  discountPercentage?: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  description: string;
  tags?: string[];
}

interface WelcomingProps {
  products: Product[];
  featuredDiscountedProducts?: Product[];
  onViewAllDiscounts?: () => void;
}

const Welcoming: React.FC<WelcomingProps> = ({ 
  products, 
  featuredDiscountedProducts = [],
  onViewAllDiscounts = () => {}
}) => {
  // Usamos useMemo para mantener los mismos productos entre renders
  const featuredProducts = useMemo(() => {
    if (!products.length) return [];
    // Usamos un índice fijo para mantener consistencia
    const startIndex = 10;
    return products.slice(startIndex, startIndex + 4);
  }, [products]);

  const recommendedProducts = useMemo(() => {
    if (!products.length) return [];
    // Usamos un índice fijo diferente para las recomendaciones
    const startIndex = 4;
    return products.slice(startIndex, startIndex + 4);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Sección de productos en descuento */}
      {featuredDiscountedProducts.length > 0 && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 group"
        >
          <motion.div 
            className="md:absolute md:-inset-1 md:bg-gradient-to-r md:from-blue-400 md:to-purple-500 md:rounded-2xl md:opacity-0 md:group-hover:opacity-75 md:transition-opacity md:duration-300"
            style={{ filter: 'blur(16px)', zIndex: -1 }}
          />
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="text-red-500 mr-3">🔥</span> Ofertas Especiales
            </h2>
            <motion.button 
              onClick={onViewAllDiscounts}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-all px-4 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg"
            >
              Ver todos los descuentos →
            </motion.button>
          </div>
          <CardContainer products={featuredDiscountedProducts} />
        </motion.div>
      )}
      
      {/* Sección de productos destacados */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 group"
      >
        <motion.div 
          className="md:absolute md:-inset-1 md:bg-gradient-to-r md:from-blue-400 md:to-purple-500 md:rounded-2xl md:opacity-0 md:group-hover:opacity-75 md:transition-opacity md:duration-300"
          style={{ filter: 'blur(16px)', zIndex: -1 }}
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="text-blue-500 mr-3">✨</span> Productos Destacados
        </h2>
        <CardContainer 
          products={featuredProducts.map(p => ({...p}))} 
        />
      </motion.div>

      {/* Sección de productos recomendados */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 md:p-6 group"
      >
        <motion.div 
          className="md:absolute md:-inset-1 md:bg-gradient-to-r md:from-blue-400 md:to-purple-500 md:rounded-2xl md:opacity-0 md:group-hover:opacity-75 md:transition-opacity md:duration-300"
          style={{ filter: 'blur(16px)', zIndex: -1 }}
        />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <span className="text-green-500 mr-3">🚀</span> Otros Productos que te podrían interesar
        </h2>
        <CardContainer 
          products={recommendedProducts.map(p => ({...p}))} 
        />
      </motion.div>
    </div>
  );
};

export default Welcoming;
