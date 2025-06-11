'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTruck, FaTimes } from 'react-icons/fa';

export default function ShippingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  // Ocultar el banner al hacer clic en la X
  const closeBanner = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 relative overflow-hidden"
        >
          <div className="container mx-auto flex items-center justify-center">
            <div className="flex items-center">
              <FaTruck className="mr-3 text-xl animate-bounce" />
              <span className="font-medium">
                🚚 ¡Envío GRATIS en compras superiores a $20.000! | ⏳ Recibe tu pedido en 24/48h
              </span>
            </div>
          </div>
          
          {/* Efecto de ola decorativo */}
          <div className="absolute -bottom-1 left-0 right-0 h-2 bg-white/10"></div>
          
          {/* Botón de cierre */}
          <button
            onClick={closeBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar banner"
          >
            <FaTimes />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
