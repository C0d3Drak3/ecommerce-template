'use client';
import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  brand: string; // Añadido para consistencia con ProductCard
  discountPercentage?: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  description: string;
  tags?: string[];
}

interface CardContainerProps {
  products: Product[];
  title?: string;
}

const CardContainer: React.FC<CardContainerProps> = ({ products, title }) => {
  return (
    <div className="py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="min-h-[300px]">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
