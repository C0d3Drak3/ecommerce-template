'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface TransactionItem {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  quantity: number;
  thumbnail: string;
  subtotal: number;
}

interface Transaction {
  id: number;
  total: number;
  createdAt: string;
  items: TransactionItem[];
}

export default function AccountPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Solo verificar la autenticación después de que se haya completado la carga inicial
    if (!authLoading && !user) {
      router.push('/login?redirect=/account');
      return;
    }

    // Solo obtener transacciones si el usuario está autenticado
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/transactions');
        const data = await response.json();

        if (data.success) {
          setTransactions(data.transactions);
        } else {
          throw new Error(data.message || 'Error al obtener el historial');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Error al cargar el historial de compras');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user, router]);

  // Mostrar carga mientras se verifica la autenticación o se cargan las transacciones
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Información de la cuenta */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Mi Cuenta</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Nombre:</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Historial de compras */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4">Historial de Compras</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Cargando historial...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No hay compras realizadas aún
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Pedido #{transaction.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-blue-600">
                    Total: ${transaction.total.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-4">
                  {transaction.items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-contain rounded-md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        <div className="space-y-1">
                          {item.discountPercentage > 0 ? (
                            <>
                              <p className="text-sm text-gray-600">
                                {item.quantity} x ${item.discountedPrice.toFixed(2)}
                                <span className="ml-1 bg-red-100 text-red-800 text-xs font-medium px-1.5 py-0.5 rounded">
                                  -{item.discountPercentage}%
                                </span>
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ${item.price.toFixed(2)} c/u
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-600">
                              {item.quantity} x ${item.price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${item.subtotal.toFixed(2)}
                        </p>
                        {item.discountPercentage > 0 && (
                          <p className="text-xs text-green-600">
                            Ahorraste ${((item.price * item.quantity) - item.subtotal).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
