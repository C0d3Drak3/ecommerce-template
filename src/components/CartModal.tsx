'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartModal() {
  const { items, isModalOpen, closeModal, removeFromCart, updateQuantity } = useCart();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  const total = items.reduce((sum, item) => {
    const itemPrice = item.discountPercentage && item.discountPercentage > 0 
      ? item.price * (1 - item.discountPercentage / 100) 
      : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const baseButtonClasses = "px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform border-b-4 active:translate-y-px active:border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const primaryButtonClasses = `${baseButtonClasses} bg-blue-600 border-blue-800 hover:bg-blue-500 active:border-blue-700 focus:ring-blue-500`;
  const secondaryButtonClasses = `${baseButtonClasses} bg-gray-600 border-gray-800 hover:bg-gray-500 active:border-gray-700 focus:ring-gray-500`;
  const redButtonClasses = `${baseButtonClasses} bg-red-600 border-red-800 hover:bg-red-500 active:border-red-700 focus:ring-red-500`;

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end"
        >
          <motion.div
            ref={modalRef}
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 text-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-white/10"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Carrito</h2>
              <button onClick={closeModal} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  <h3 className="text-xl font-semibold text-gray-400">Tu carrito está vacío</h3>
                  <p className="mt-2 text-sm">Añade productos para verlos aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-gray-800/50 p-4 rounded-lg border border-white/10">
                      <Link href={`/product/${item.id}`} className="flex-shrink-0" onClick={closeModal}>
                        <div className="relative w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center group">
                          <Image src={item.thumbnail} alt={item.title} layout="fill" className="object-contain p-2 rounded-lg group-hover:scale-105 transition-transform" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/product/${item.id}`} onClick={closeModal}>
                          <h3 className="font-semibold text-gray-100 truncate hover:text-blue-400 transition-colors">{item.title}</h3>
                        </Link>
                        <div className="space-y-1 mt-1">
                          {item.discountPercentage && item.discountPercentage > 0 ? (
                            <>
                              <p className="text-blue-400 font-bold text-lg">
                                ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                                <span className="ml-2 bg-red-500/20 text-red-300 text-xs font-medium px-2 py-1 rounded-full">
                                  -{item.discountPercentage}%
                                </span>
                              </p>
                              <p className="text-gray-500 text-sm line-through">${item.price.toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="text-blue-400 font-bold text-lg">${item.price.toFixed(2)}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className={`${secondaryButtonClasses} !p-0 w-8 h-8 flex items-center justify-center !rounded-full !border-2 disabled:opacity-50 disabled:cursor-not-allowed`}>-</button>
                          <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={`${secondaryButtonClasses} !p-0 w-8 h-8 flex items-center justify-center !rounded-full !border-2`}>+</button>
                          <button onClick={() => removeFromCart(item.id)} className={`${redButtonClasses} !p-0 w-8 h-8 flex items-center justify-center !rounded-full !border-2 ml-auto`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-5 space-y-4 bg-gray-900/50">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">${total.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={closeModal} className={secondaryButtonClasses}>
                    Seguir Comprando
                  </button>
                  <Link href="/cart" className={`${primaryButtonClasses} text-center`} onClick={closeModal}>
                    Finalizar Compra
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
