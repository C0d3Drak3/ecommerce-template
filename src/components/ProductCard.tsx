'use client';
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type ProductProps = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
};

const ProductCard = ({ id, title, price, imageUrl, category }: ProductProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      href={`/product/${id}`} 
      className="block bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer hover:scale-105 transform duration-300"
    >
      <div className="relative h-48 mb-4 bg-gray-100 rounded-md overflow-hidden">
        {/* Placeholder mientras carga */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Placeholder en caso de error */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-400 text-sm text-center p-4">
              Imagen no disponible
            </div>
          </div>
        )}

        {/* Imagen real */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`rounded-md object-cover transition-opacity duration-300 ${
            imageLoading || imageError ? 'opacity-0' : 'opacity-100'
          }`}
          loading="lazy"
          quality={60}
          onLoadingComplete={() => setImageLoading(false)}
          onError={() => {
            setImageLoading(false);
            setImageError(true);
          }}
          priority={false}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-500 capitalize">{category}</p>
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        <p className="text-xl font-bold text-blue-600">${price.toFixed(2)}</p>
        <div className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center">
          Ver detalles
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
