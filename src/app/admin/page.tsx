'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gestión de Productos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Gestión de Productos</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/products')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver Productos
            </button>
            <button
              onClick={() => router.push('/admin/products/new')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Gestión de Promociones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Promociones</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/promotions')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Gestionar Promociones
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Estadísticas</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/stats')}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Ver Estadísticas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
