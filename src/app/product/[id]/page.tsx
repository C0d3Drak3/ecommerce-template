'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ProductDetail from '@/components/ProductDetail';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  stock: number;
  brand: string;
  tags: string[];
}

// Definir el tipo para los parámetros
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  // Usar use para resolver la promesa de params
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        setProduct(data.product);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Eliminamos handleQuantityChange ya que se maneja internamente en ProductDetail

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">Cargando producto...</div>
          <div className="text-gray-500">Por favor espera</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">Error</div>
          <div className="text-gray-700 mb-4">{error || 'Producto no encontrado'}</div>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Pasar solo el producto como prop, ya que el manejo de cantidad está dentro de ProductDetail
  return <ProductDetail product={product} />;
}
