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
    // Solo verificar la autenticación después de que se haya completado la carga inicial
    if (!authLoading && !user) {
      router.push('/login?redirect=/cart');
      return;
    }
    
    // Actualizar el estado de carga una vez que se completa la verificación
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, router, authLoading]);

  const calculateItemPrice = (item: any) => {
    return item.discountPercentage && item.discountPercentage > 0 
      ? item.price * (1 - item.discountPercentage / 100)
      : item.price;
  };

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = calculateItemPrice(item);
    return sum + itemPrice * item.quantity;
  }, 0);

  const total = subtotal; // Aquí podrías agregar impuestos, envío, etc. si es necesario

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

  // Mostrar carga mientras se verifica la autenticación
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirigir si no hay usuario (ya debería manejarse en el efecto)
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">
            Tu carrito está vacío
          </h2>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Continuar Comprando
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 bg-white p-4 rounded-lg shadow"
              >
                {/* Imagen */}
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>

                {/* Detalles */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <div className="space-y-1">
                        {item.discountPercentage && item.discountPercentage > 0 ? (
                          <>
                            <p className="text-xl font-bold text-blue-600">
                              ${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
                              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded">
                                -{item.discountPercentage}%
                              </span>
                            </p>
                            <p className="text-gray-500 text-sm line-through">
                              ${item.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-xl font-bold text-blue-600">
                            ${item.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center gap-2 mt-4  ">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 rounded-md hover:bg-blue-600 bg-blue-300 disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-12 text-center text-lg font-medium text-gray-950">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-md hover:bg-blue-600 bg-blue-300"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v12m6-6H6"
                        />
                      </svg>
                    </button>

                    <div className="ml-auto text-right">
                      <p className="text-lg font-medium text-gray-950">
                        ${(calculateItemPrice(item) * item.quantity).toFixed(2)}
                      </p>
                      {item.discountPercentage && item.discountPercentage > 0 && (
                        <p className="text-sm text-gray-500 line-through">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-950">Resumen de la Orden</h2>

              <div className="space-y-3 mb-6">
                <div className="space-y-2">
                  {items.some(item => item.discountPercentage && item.discountPercentage > 0) && (
                    <div className="bg-yellow-50 p-3 rounded-md mb-2">
                      <p className="text-sm text-yellow-700">
                        ¡Aprovechaste descuentos en tu compra!
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} productos)</span>
                    <span>${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  {items.some(item => item.discountPercentage && item.discountPercentage > 0) && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuentos</span>
                      <span>-${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) - subtotal).toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-3 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-950">
                    <span>Total</span>
                    <div className="text-right">
                      <p className="text-blue-600">${subtotal.toFixed(2)}</p>
                      {items.some(item => item.discountPercentage && item.discountPercentage > 0) && (
                        <p className="text-xs text-gray-500">
                          Ahorraste ${(items.reduce((sum, item) => sum + (item.price * item.quantity), 0) - subtotal).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Proceder al Pago
              </button>

              <button
                onClick={() => router.push('/')}
                className="w-full mt-4 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-medium transition"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
