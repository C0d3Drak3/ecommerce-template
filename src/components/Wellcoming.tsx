//Componente renderizable cuando se llega a la pagina y no se esta buscando nada en especifico
//Se renderiza un listado de productos destacados y otros productos que podrian interesar
'use client';
import React, { useMemo } from "react";
import CardContainer from "./CardContainer";

interface Product {
  id: number;
  title: string;
  price: number;
  discountPercentage?: number;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  description: string;
  tags?: string[];
}

interface WelcomingProps {
  products: Product[];
}

const Welcoming: React.FC<WelcomingProps> = ({ products }) => {
  // Usamos useMemo para mantener los mismos productos entre renders
  const featuredProducts = useMemo(() => {
    if (!products.length) return [];
    // Usamos un índice fijo para mantener consistencia
    const startIndex = 0;
    return products.slice(startIndex, startIndex + 4);
  }, [products]);

  const recommendedProducts = useMemo(() => {
    if (!products.length) return [];
    // Usamos un índice fijo diferente para las recomendaciones
    const startIndex = 4;
    return products.slice(startIndex, startIndex + 4);
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CardContainer 
        products={featuredProducts.map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          discountPercentage: p.discountPercentage,
          imageUrl: p.imageUrl,
          thumbnailUrl: p.thumbnailUrl,
          category: p.category,
          description: p.description,
          tags: p.tags
        }))} 
        title="Productos Destacados" 
      />
      
      <div className="my-12 border-t border-gray-200" />
      
      <CardContainer 
        products={recommendedProducts.map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          discountPercentage: p.discountPercentage,
          imageUrl: p.imageUrl,
          thumbnailUrl: p.thumbnailUrl,
          category: p.category,
          description: p.description,
          tags: p.tags
        }))} 
        title="Otros Productos que te podrían interesar" 
      />
    </div>
  );
};

export default Welcoming;
