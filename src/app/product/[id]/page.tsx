// app/product/[id]/page.tsx
import ProductDetail from "@/components/ProductDetail";

const ProductPage = () => {
  // Simulación de datos de producto (después esto se traerá de la DB)
  const product = {
    name: "Ejemplo de Producto",
    image: "https://via.placeholder.com/400",
    price: 49.99,
    description: "Este es un producto de prueba con una descripción genérica.",
  };

  return (
    <div className="p-8">
      <ProductDetail {...product} />
    </div>
  );
};

export default ProductPage;
