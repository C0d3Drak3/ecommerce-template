// components/ProductDetail.tsx
'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  stock: number;
  brand: string;
  tags: string[];
}

interface ProductDetailProps {
  product: Product;
  quantity: number;
  onQuantityChange: (value: number) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, quantity, onQuantityChange }: ProductDetailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
      <button
        onClick={() => {
          const urlParams = new URLSearchParams(window.location.search);
          const backUrl = urlParams.get('back') || '/';
          window.location.href = backUrl;
        }}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div className="relative h-96 md:h-[600px] group">
          <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-lg overflow-hidden">
            {/* Thumbnail como placeholder */}
            <Image
              src={product.thumbnailUrl}
              alt={`${product.title} (thumbnail)`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className={`rounded-xl object-contain transition-opacity duration-500 ${!isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              priority
            />

            {/* Imagen principal de alta resolución */}
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className={`rounded-xl object-contain transition-all duration-500 group-hover:scale-105 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoadingComplete={() => {
                // Cuando la imagen principal se carga, la mostramos y ocultamos el thumbnail
                setIsImageLoading(false);
              }}
              onError={() => {
                // Si la imagen principal falla, mantenemos el thumbnail visible
                setIsImageLoading(true);
              }}
            />
          </div>
        </div>

        {/* Detalles del producto */}
        <div className="space-y-8 px-4">
          <div>
            <p className="text-sm text-blue-600 font-semibold tracking-wide uppercase">{product.category}</p>
            <h1 className="text-4xl font-bold mt-2 text-gray-900">{product.title}</h1>
            <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          </div>

          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-4xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2 flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Stock disponible: {product.stock} unidades
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => onQuantityChange(quantity - 1)}
                className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200 border-r-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200 border-l-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95">
              Agregar al carrito
            </button>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Detalles adicionales:</h3>
            <p className="text-gray-600 flex items-center">
              <span className="font-medium text-gray-800 mr-2">Marca:</span>
              {product.brand}
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="mt-4">
                <p className="font-medium text-gray-800 mb-2">Etiquetas:</p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
