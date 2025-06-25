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
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">Herramientas de Administración</h2>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {/* Gestión de Productos */}
            <li className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gestión de Productos</h3>
                  <p className="text-sm text-gray-500">Administra el catálogo de productos</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Ver Todo
                  </button>
                  <button
                    onClick={() => router.push('/admin/products/new')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                  >
                    Nuevo
                  </button>
                </div>
              </div>
            </li>
            
            {/* Gestión de Promociones */}
            <li className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gestión de Promociones</h3>
                  <p className="text-sm text-gray-500">Administra descuentos y ofertas</p>
                </div>
                <button
                  onClick={() => router.push('/admin/sales')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                >
                  Gestionar
                </button>
              </div>
            </li>
            
            {/* Gestión de Usuarios */}
            <li className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
                  <p className="text-sm text-gray-500">Administra usuarios y permisos</p>
                </div>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm"
                >
                  Administrar
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
