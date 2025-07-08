'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
}

interface RelatedProductsProps {
  currentProductId: number;
  tags: string[];
  category: string;
}

export default function RelatedProducts({ currentProductId, tags, category }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        
        // Llamamos al endpoint que ya maneja la lógica de búsqueda
        const response = await fetch(
          `/api/products/related?exclude=${currentProductId}` +
          `&tags=${tags.join(',')}` +
          `&category=${encodeURIComponent(category)}`
        );
        
        const data = await response.json();
        
        if (data.success) {
          // Si la petición fue exitosa, mostramos los productos que nos devolvió
          setRelatedProducts(data.products);
        } else {
          // Si hay un error, no mostramos nada
          setRelatedProducts([]);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, tags, category]);

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6">Productos Relacionados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-[380px] w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-24">
      <h3 className="text-xl font-semibold text-center text-gray-900 mb-6">Productos Relacionados</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedProducts.map((product) => {
          // Asegurarse de que las URLs de las imágenes no estén vacías
          const safeImageUrl = (product.imageUrl || '').trim() || '/placeholder-product.jpg';
          const safeThumbnailUrl = (product.thumbnailUrl || safeImageUrl).trim();
          
          return (
            <div key={product.id} className="h-full">
              <ProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                discountPercentage={product.discountPercentage}
                imageUrl={safeImageUrl}
                thumbnailUrl={safeThumbnailUrl}
                category={product.category}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
