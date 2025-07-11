// components/ProductDetail.tsx
'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import RelatedProducts from './RelatedProducts';

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

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }: ProductDetailProps) => {
  const [selectedImage, setSelectedImage] = useState(product.thumbnailUrl);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { updateQuantity, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const allImages = [product.imageUrl, ...(product.tags?.map((_, i) => `https://dummyimage.com/600x600/94a3b8/ffffff&text=Image+${i + 2}`) || [])];

  const baseButtonClasses = "px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 transform border-b-4 active:translate-y-px active:border-b-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const primaryButtonClasses = `${baseButtonClasses} bg-blue-600 border-blue-800 hover:bg-blue-500 active:border-blue-700 focus:ring-blue-500`;
  const secondaryButtonClasses = `${baseButtonClasses} bg-gray-600 border-gray-800 hover:bg-gray-500 active:border-gray-700 focus:ring-gray-500`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className={`${secondaryButtonClasses} mb-8 inline-flex items-center`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver
        </button>

        <div className="bg-gray-800/50 rounded-2xl shadow-2xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 border border-white/10">
          {/* Galería de Imágenes */}
          <div className="flex flex-col gap-4">
            <div className="relative h-80 md:h-96 group rounded-xl overflow-hidden">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                <Image
                  key={selectedImage} // Re-trigger load on image change
                  src={selectedImage}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              {allImages.slice(0, 5).map((img, index) => (
                <button key={index} onClick={() => setSelectedImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-blue-500 scale-110' : 'border-transparent hover:border-blue-500/50'}`}>
                  <Image src={img} alt={`Thumbnail ${index + 1}`} width={80} height={80} className="object-cover w-full h-full" loading="lazy" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Detalles del Producto */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-sm text-blue-400 font-semibold tracking-wide uppercase">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">{product.title}</h1>
              <p className="text-gray-400 mt-4 leading-relaxed">{product.description}</p>
            </div>

            <div className="bg-gray-900/70 p-6 rounded-lg border border-white/10">
              {product.discountPercentage && product.discountPercentage > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-blue-400">
                      ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                    </p>
                    <p className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</p>
                    <span className="bg-red-500/20 text-red-300 text-sm font-medium px-2.5 py-1 rounded-full">
                      -{product.discountPercentage}%
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-4xl font-bold text-blue-400">${product.price.toFixed(2)}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`${secondaryButtonClasses} !p-0 w-10 h-10 flex items-center justify-center !rounded-full !border-2`}>-</button>
                <span className="w-12 text-center text-2xl font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className={`${secondaryButtonClasses} !p-0 w-10 h-10 flex items-center justify-center !rounded-full !border-2`}>+</button>
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
                className={`${primaryButtonClasses} flex-1`}
              >
                {isAdding ? 'Agregando...' : 'Agregar al carrito'}
              </button>
            </div>

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-semibold text-lg mb-4 text-gray-200">Detalles Adicionales</h3>
              <p className="text-gray-400"><span className="font-medium text-gray-300">Marca:</span> {product.brand}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <p className="font-medium text-gray-300 mb-2">Etiquetas:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-24">
          <RelatedProducts currentProductId={product.id} tags={product.tags} category={product.category} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
