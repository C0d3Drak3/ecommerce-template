'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProductProps = {
  id: number;
  title: string;
  price: number;
  brand: string;
  discountPercentage?: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  priority?: boolean;
};

const ProductCard = ({ id, title, price, discountPercentage, thumbnailUrl, category, brand, priority = false }: ProductProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="group relative flex flex-col bg-gray-800/40 backdrop-blur-sm border border-white/20 md:border-white/10 rounded-xl transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.3)] md:shadow-none scale-105 md:scale-100 h-[280px] md:h-[380px] md:hover:border-white/20 md:hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] md:hover:scale-105">
      <Link href={`/product/${id}`} className="flex flex-col h-full p-3" prefetch={false}>
        <div className="relative h-24 md:h-48 mb-3 bg-black/20 rounded-md overflow-hidden flex-shrink-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="300px"
            className={`object-contain transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            priority={priority}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => setIsLoading(true)} // Reintentar o mostrar placeholder
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-grow justify-between min-h-0">
          <div className="space-y-1.5 flex-shrink overflow-hidden">
            <p className="text-sm text-gray-400 capitalize truncate">{category}</p>
            <h3 className="text-sm md:text-lg font-semibold line-clamp-2 min-h-[2.5rem] text-white md:text-gray-100 md:group-hover:text-white transition">{title}</h3>
            <div className="mt-1 min-h-[2.2rem]">
              {discountPercentage && discountPercentage > 0 ? (
                <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
                  <span className="text-gray-500 line-through text-sm md:text-md">${price.toFixed(2)}</span>
                  <span className="text-blue-400 font-bold text-xl md:text-2xl">${(price * (1 - (discountPercentage / 100))).toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-blue-400 font-bold text-xl md:text-2xl">${price.toFixed(2)}</span>
              )}
            </div>
          </div>
          

        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
