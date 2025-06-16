'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importación dinámica para SSR
const LowStockAlerts = dynamic(
  () => import('@/components/admin/LowStockAlerts'),
  { ssr: false }
);

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // Solo redirigir si ya se completó la carga y no hay usuario
      router.push('/login?redirect=/admin');
      return;
    }
    
    if (!isLoading && user && user.role !== 'ADMIN') {
      // Solo redirigir si ya se completó la carga y el usuario no es admin
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Mostrar carga mientras se verifica la autenticación
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Verificar rol de administrador después de la carga
  if (user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Sección de Alertas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Alertas</h2>
        <LowStockAlerts />
      </div>
      
      <h2 className="text-2xl font-semibold mb-6">Herramientas</h2>

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
              onClick={() => router.push('/admin/sales')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Gestionar Descuentos
            </button>
            <button
              onClick={() => router.push('/admin/promotions')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              Crear Promoción
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
