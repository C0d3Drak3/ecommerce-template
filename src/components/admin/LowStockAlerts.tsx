'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiChevronDown, FiChevronUp, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  stock: number;
  price: number;
  category: string;
  thumbnail: string;
}

const LowStockAlerts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Iniciando solicitud a /api/admin/products/low-stock');
        const response = await fetch('/api/admin/products/low-stock', {
          credentials: 'include' // Importante para incluir las cookies
        });
        
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        const data = await response.json().catch(e => {
          console.error('Error al parsear la respuesta:', e);
          throw new Error('Formato de respuesta inválido');
        });
        
        if (!response.ok) {
          console.error('Error en la respuesta:', data);
          throw new Error(data.error || 'Error al cargar productos con stock bajo');
        }
        
        console.log('Productos con stock bajo:', data.products);
        setProducts(data.products || []);
      } catch (err: any) {
        console.error('Error en fetchLowStockProducts:', err);
        setError(err.message || 'No se pudieron cargar las alertas de stock');
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchLowStockProducts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="animate-pulse flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar alertas de stock</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1 text-xs text-red-600">
                  Intenta recargar la página. Si el problema persiste, contacta al administrador.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 bg-green-50 border-l-4 border-green-400">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiPackage className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">¡Todo en orden!</h3>
              <p className="text-sm text-green-700">No hay productos con stock bajo en este momento.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left bg-yellow-50 hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="font-medium text-yellow-800">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} con stock bajo
          </h3>
        </div>
        {isExpanded ? (
          <FiChevronUp className="h-5 w-5 text-yellow-500" />
        ) : (
          <FiChevronDown className="h-5 w-5 text-yellow-500" />
        )}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                      return (
                        <tr key={product.id} className={product.stock === 0 ? 'bg-red-50' : 'bg-yellow-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {product.thumbnail && (
                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={product.thumbnail}
                                    alt={product.title}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.title}</div>
                                <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.stock === 0 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              href={`/admin/products/edit/${product.id}`}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Editar
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LowStockAlerts;
