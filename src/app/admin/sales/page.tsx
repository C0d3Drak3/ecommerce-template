'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiSave, FiX, FiTag } from 'react-icons/fi';

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  imageUrl: string;
  category: string;
}

export default function DiscountsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [tempDiscount, setTempDiscount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchProducts();
  }, [user, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Error al cargar productos');
      }
    } catch (err) {
      setError('Error al cargar los productos. Por favor, inténtalo de nuevo.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (product: Product) => {
    setEditingProduct(product.id);
    setTempDiscount(product.discountPercentage || 0);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setTempDiscount(0);
  };

  const saveDiscount = async (productId: number) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      console.log('Preparando datos para actualizar...');
      const requestBody = {
        discount: tempDiscount, // Mantenemos este nombre para la API, pero se mapeará a discountPercentage en el backend
      };
      console.log('Datos a enviar:', requestBody);

      console.log('Enviando solicitud de actualización...');
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      console.log('Respuesta recibida, status:', response.status);
      
      // Intentar analizar la respuesta como JSON
      let responseData;
      try {
        responseData = await response.json();
        console.log('Datos de la respuesta:', responseData);
      } catch (parseError) {
        console.error('Error al analizar la respuesta JSON:', parseError);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }

      if (!response.ok) {
        console.error('Error en la respuesta:', responseData);
        // Si hay un mensaje de error en la respuesta, usarlo
        const errorMessage = responseData?.message || 
                             responseData?.error || 
                             `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Si llegamos aquí, la actualización fue exitosa
      console.log('Actualización exitosa:', responseData);

      // Actualizar la lista de productos con el nuevo descuento
      setProducts(products.map(p => 
        p.id === productId ? { ...p, discountPercentage: tempDiscount } : p
      ));
      
      setSuccess('Descuento actualizado correctamente');
      setEditingProduct(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el descuento';
      console.error('Error en saveDiscount:', {
        message: errorMessage,
        error: err,
        timestamp: new Date().toISOString()
      });
      setError(`Error: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-white rounded-lg shadow p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-300 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administración de Descuentos</h1>
            <p className="text-gray-600">Gestiona los descuentos de los productos</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
            <p>{success}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descuento Actual
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{formatPrice(product.price)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingProduct === product.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tempDiscount}
                            onChange={(e) => setTempDiscount(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <FiTag className="h-4 w-4 text-gray-400 mr-1" />
                          <span className={`text-sm font-medium ${product.discountPercentage > 0 ? 'text-red-500' : 'text-gray-900'}`}>
                            {product.discountPercentage || 0}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingProduct === product.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => cancelEditing()}
                            className="text-gray-600 hover:text-gray-900 bg-white border border-gray-300 px-3 py-1 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => saveDiscount(product.id)}
                            disabled={saving}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {saving ? 'Guardando...' : <FiSave className="h-4 w-4" />}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
