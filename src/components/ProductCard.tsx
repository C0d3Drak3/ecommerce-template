// components/ProductCard.tsx
'use client';
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
  return (
    <Link href={`/product/${id}`} className="block">
      <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer hover:scale-105 transform duration-300">
        <div className="relative h-48 mb-4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500 capitalize">{category}</p>
          <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
          <p className="text-xl font-bold text-blue-600">${price.toFixed(2)}</p>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Ver detalles
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
