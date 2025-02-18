// app/product/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

const ProductPage = () => {
  const params = useParams();
  if (!params?.id) return <p>Producto no encontrado</p>;

  const { id } = params; // Ahora `id` se obtiene sin problemas

  const product = {
    id,
    name: `Producto ${id}`,
    image: "https://via.placeholder.com/400",
    price: 49.99,
    description: "Descripción de prueba para este producto.",
  };

  return (
    <div className="p-8">
      <ProductDetail {...product} />
    </div>
  );
};

export default ProductPage;
