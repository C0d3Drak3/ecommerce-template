// components/ProductDetail.tsx
'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

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
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }: ProductDetailProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { updateQuantity, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
      <button
        onClick={() => {
          const urlParams = new URLSearchParams(window.location.search);
          const backUrl = urlParams.get('back') || '/';
          window.location.href = backUrl;
        }}
        className="mb-6 w-24 h-10 flex items-center justify-center rounded-lg bg-slate-400 text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
              className={`rounded-xl object-contain  ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
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
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200 border-r-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(Math.max(1, val), product.stock));
                }}
                className="w-20 text-center py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max={product.stock}
              />
              <button
                onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}
                className="px-4 py-2 text-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200 border-l-2 border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <button 
              onClick={async () => {
                if (!user) {
                  router.push('/login');
                  return;
                }

                setIsAdding(true);
                try {
                  await updateQuantity(product.id, quantity);
                  await refreshCart();
                  
                  // Mostrar mensaje de éxito
                  const message = document.createElement('div');
                  message.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 translate-y-0';
                  message.textContent = '¡Producto agregado al carrito!';
                  document.body.appendChild(message);

                  // Remover mensaje después de 3 segundos
                  setTimeout(() => {
                    message.style.transform = 'translateY(200%)';
                    setTimeout(() => {
                      document.body.removeChild(message);
                    }, 500);
                  }, 3000);

                } catch (error) {
                  console.error('Error adding to cart:', error);
                } finally {
                  setIsAdding(false);
                }
              }}
              disabled={isAdding}
              className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isAdding ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Agregando...
                </span>
              ) : (
                'Agregar al carrito'
              )}
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
