'use client';
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import CardContainer from "./CardContainer";

// Componente de papel plegado para separar secciones
const PaperFold = ({ className = "", isLast = false }) => {
  if (isLast) return null; // No mostrar en la última sección
  
  return (
    <div className={`relative h-20 w-full ${className} overflow-hidden`}>
      <div className="absolute -left-4 -right-4 bottom-0 h-20 bg-white dark:bg-gray-900 transform -skew-y-3 origin-top"></div>
      <div className="absolute -left-4 -right-4 bottom-0 h-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transform -skew-y-2 origin-top"></div>
    </div>
  );
};

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
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      {/* Sección de productos en descuento */}
      {featuredDiscountedProducts.length > 0 && (
        <motion.div 
          className="relative bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl p-6 z-10"
          style={{
            marginBottom: '4rem',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), 0% 100%)',
            paddingBottom: '3rem'
          }}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="text-red-500 mr-2">🔥</span> Ofertas Especiales
            </h2>
            <motion.button 
              onClick={onViewAllDiscounts}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-all px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
            >
              Ver todos los descuentos →
            </motion.button>
          </div>
          <CardContainer products={featuredDiscountedProducts} />
          <PaperFold className="-bottom-8 left-0 right-0" />
        </motion.div>
      )}
      
      {/* Sección de productos destacados */}
      <motion.div 
        className="relative bg-gray-50 dark:bg-gray-800 shadow-2xl p-6 z-20"
        style={{
          marginTop: '-4rem',
          marginBottom: '4rem',
          clipPath: 'polygon(0 20px, 100% 0, 100% calc(100% - 20px), 0% 100%)',
          paddingTop: '3rem',
          paddingBottom: '3rem'
        }}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute -top-4 left-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Destacados
        </div>
        <CardContainer 
          products={featuredProducts.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            discountPercentage: p.discountPercentage,
            imageUrl: p.imageUrl,
            thumbnailUrl: p.thumbnailUrl,
            category: p.category,
            description: p.description,
            tags: p.tags
          }))} 
          title="Productos Destacados" 
        />
        <PaperFold className="-bottom-16 -left-4 -right-4" />
      </motion.div>
      
      {/* Sección de productos recomendados */}
      <motion.div 
        className="relative bg-white dark:bg-gray-900 rounded-b-2xl shadow-2xl p-6 z-30"
        style={{
          marginTop: '-4rem',
          clipPath: 'polygon(0 20px, 100% 0, 100% 100%, 0% 100%)',
          paddingTop: '3rem',
          paddingBottom: '2rem'
        }}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        transition={{ delay: 0.2 }}
      >
        <div className="absolute -top-4 left-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          Recomendados
        </div>
        <CardContainer 
          products={recommendedProducts.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            discountPercentage: p.discountPercentage,
            imageUrl: p.imageUrl,
            thumbnailUrl: p.thumbnailUrl,
            category: p.category,
            description: p.description,
            tags: p.tags
          }))} 
          title="Otros Productos que te podrían interesar" 
        />
      </motion.div>
    </div>
  );
};

export default Welcoming;
