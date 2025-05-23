'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type ProductProps = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
};

const ProductCard = ({ id, title, price, imageUrl, thumbnailUrl, category }: ProductProps) => {
  const searchParams = useSearchParams();
  const currentUrl = `${window.location.pathname}${window.location.search}`;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Simplificar la carga de imagen
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="flex flex-col bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer hover:scale-105 transform duration-300 w-full h-[400px]">
      <Link 
        href={`/product/${id}?back=${encodeURIComponent(currentUrl)}`}
        className="block"
        prefetch={false}
      >
      <div className="relative h-48 mb-4 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        {/* Placeholder de carga */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Placeholder de error */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <span className="text-gray-400">Error al cargar</span>
          </div>
        )}

        {/* Imagen */}
        <div className="relative w-full h-full">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="300px"
            className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            quality={25}
            onLoadingComplete={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            unoptimized
          />
        </div>
      </div>

      <div className="flex flex-col justify-between flex-grow min-h-0">
        <div className="space-y-2 flex-shrink overflow-hidden">
          <p className="text-sm text-gray-500 capitalize truncate">{category}</p>
          <h3 className="text-lg font-semibold line-clamp-2 min-h-[3.5rem]">{title}</h3>
          <p className="text-xl font-bold text-blue-600">${price.toFixed(2)}</p>
        </div>
        <div className="mt-auto pt-4 ">
          <div className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center">
            Ver detalles
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default ProductCard;
