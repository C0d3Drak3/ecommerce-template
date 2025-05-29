'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
    title: string;
  }[];
}

interface User {
  name: string;
  email: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();

        if (!data.success) {
          router.push('/login');
          return;
        }

        setUser(data.user);
      } catch (error) {
        setError('Error al cargar datos del usuario');
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/user/orders');
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        setError('Error al cargar el historial de compras');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchOrders();
  }, [router]);

  if (loading) {
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
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl text-gray-800 font-bold mb-4">Mi Cuenta</h2>
        {user && (
          <div className="space-y-4">
            <p><span className="font-semibold">Nombre:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl text-gray-600 font-bold mb-6">Historial de Compras</h3>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold">Orden #{order.id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.title} (x{item.quantity})</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">
            No tienes compras realizadas aún.
          </p>
        )}
      </div>
    </div>
  );
}
