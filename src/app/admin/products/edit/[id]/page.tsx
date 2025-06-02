'use client';
import ProductForm from '@/components/ProductForm';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  brand: string;
  tags: string[];
}

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Error al cargar el producto');
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  return <ProductForm mode="edit" initialData={product} />;
}
