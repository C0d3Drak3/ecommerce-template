'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { items, removeFromCart, updateQuantity, refreshCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/cart');
      return;
    }
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, router, authLoading]);

  const calculateItemPrice = (item: any) => {
    return item.discountPercentage && item.discountPercentage > 0
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
  };

  const subtotal = items.reduce((sum, item) => sum + calculateItemPrice(item) * item.quantity, 0);
  const total = subtotal; // Placeholder for future fees

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Mostrar mensaje de éxito
        const message = document.createElement('div');
        message.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 translate-y-0';
        message.textContent = '¡Pedido realizado con éxito!';
        document.body.appendChild(message);

        // Remover mensaje después de 3 segundos
        setTimeout(() => {
          message.style.transform = 'translateY(200%)';
          setTimeout(() => {
            document.body.removeChild(message);
          }, 500);
        }, 3000);

        // Actualizar el estado del carrito
        await refreshCart();
        
        // Redirigir a la página principal
        router.replace('/');
      } else {
        throw new Error(data.message || 'Error al procesar el pedido');
      }
    } catch (error) {
      console.error('Error en checkout:', error);
      alert('Error al procesar el pedido. Por favor, intente nuevamente.');
    }
  };

  const baseButtonClasses = "w-full px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform border-b-4 active:translate-y-px active:border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const primaryButtonClasses = `${baseButtonClasses} bg-blue-600 border-blue-800 hover:bg-blue-500 active:border-blue-700 focus:ring-blue-500`;
  const secondaryButtonClasses = `${baseButtonClasses} bg-gray-600 border-gray-800 hover:bg-gray-500 active:border-gray-700 focus:ring-gray-500`;
  const redButtonClasses = "px-2 py-2 rounded-full font-semibold text-white transition-all duration-200 transform border-b-4 active:translate-y-px active:border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 bg-red-600 border-red-800 hover:bg-red-500 active:border-red-700 focus:ring-red-500";

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Tu Carrito</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-white/10">
             <svg className="mx-auto h-24 w-24 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h2 className="mt-6 text-2xl font-semibold text-gray-300">Tu carrito está vacío</h2>
            <p className="mt-2 text-gray-500">Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
            <button onClick={() => router.push('/')} className={`${primaryButtonClasses} mt-8 !w-auto`}>
              Explorar Productos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-800/50 p-4 rounded-lg border border-white/10 items-center">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-white/10 rounded-lg">
                    <Image src={item.thumbnail} alt={item.title} layout="fill" className="object-contain p-2 rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-100 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.brand}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className={`${secondaryButtonClasses} !p-0 w-8 h-8 flex items-center justify-center !rounded-full !border-2 disabled:opacity-50`}>-</button>
                      <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={`${secondaryButtonClasses} !p-0 w-8 h-8 flex items-center justify-center !rounded-full !border-2`}>+</button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end justify-between h-full">
                    <p className="text-lg font-bold text-blue-400">${(calculateItemPrice(item) * item.quantity).toFixed(2)}</p>
                    {item.discountPercentage && item.discountPercentage > 0 && (
                      <p className="text-sm text-gray-500 line-through">${(item.price * item.quantity).toFixed(2)}</p>
                    )}
                    <button onClick={() => removeFromCart(item.id)} className={`${redButtonClasses} !p-0 w-8 h-8 flex items-center justify-center mt-auto`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg sticky top-8 border border-white/10">
                <h2 className="text-2xl font-semibold mb-6">Resumen</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal sin descuento</span>
                    <span>${items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                  </div>
                  {items.some(item => item.discountPercentage && item.discountPercentage > 0) && (
                    <div className="flex justify-between text-green-400">
                      <span>Descuentos</span>
                      <span>-${(items.reduce((sum, item) => sum + item.price * item.quantity, 0) - subtotal).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span>Envío</span>
                    <span className="text-green-400">Gratis</span>
                  </div>
                  <div className="border-t border-white/10 my-4"></div>
                  <div className="flex justify-between text-2xl font-bold text-white">
                    <span>Total</span>
                    <span className="text-blue-400">${total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <button onClick={handleCheckout} className={primaryButtonClasses}>
                    Proceder al Pago
                  </button>
                  <button onClick={() => router.push('/')} className={secondaryButtonClasses}>
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
