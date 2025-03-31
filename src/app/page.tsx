'use client';
import { useEffect, useState } from 'react';
import Welcoming from '@/components/Wellcoming';
import CardContainer from '@/components/CardContainer';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Fetching products...');
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Error al obtener productos');
        }
        
        console.log('✅ Products received:', data.products.length);
        setProducts(data.products);
      } catch (error) {
        console.error('❌ Error:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="text-2xl font-bold mb-2">Cargando productos...</div>
          <div className="text-gray-500">Por favor espera</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8">
          <div className="text-2xl font-bold text-red-600 mb-2">Error</div>
          <div className="text-gray-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Aquí irá el componente de filtros */}
          <div className="h-10 bg-gray-100 rounded-lg">
            ESTE DIV SERÁN LOS FILTROS
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="max-w-7xl mx-auto px-4">
          <CardContainer products={products} title="Resultados de búsqueda" />
        </div>
      ) : (
        <Welcoming products={products} />
      )}
    </main>
  );
}
