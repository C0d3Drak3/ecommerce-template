'use client';
import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
