'use client';
import React, { useRef, useEffect, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const productRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Configurar el Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productId = Number(entry.target.getAttribute('data-product-id'));
          if (entry.isIntersecting && !visibleProducts.find(p => p.id === productId)) {
            setVisibleProducts(prev => {
              const product = products.find(p => p.id === productId);
              return product ? [...prev, product] : prev;
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [products]);

  useEffect(() => {
    // Observar los elementos placeholder
    productRefs.current.forEach((ref, id) => {
      if (observerRef.current) {
        observerRef.current.observe(ref);
      }
    });
  }, [products]);

  return (
    <div className="py-8" ref={containerRef}>
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            ref={(el) => {
              if (el) {
                el.setAttribute('data-product-id', String(product.id));
                productRefs.current.set(product.id, el);
              }
            }}
            className="min-h-[300px]"
          >
            {visibleProducts.find(p => p.id === product.id) ? (
              <ProductCard {...product} />
            ) : (
              <div className="bg-gray-100 rounded-xl h-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
