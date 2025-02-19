import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

interface CardContainerProps {
  products: Product[];
}

const CardContainer: React.FC<CardContainerProps> = ({ products }) => {
  return (
    <div style={styles.container}>
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: "16px",
  } as React.CSSProperties,
};

export default CardContainer;
