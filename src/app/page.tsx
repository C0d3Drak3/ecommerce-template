//import Image from "next/image";

// app/page.tsx
import ProductCard from "@/components/ProductCard";

const Home = async () => {
  // Simulación de fetch de productos
  const products = [
    { id: 1, name: "Producto 1", price: 199.99, imageUrl: "/img1.jpg" },
    { id: 2, name: "Producto 2", price: 299.99, imageUrl: "/img2.jpg" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Productos Destacados</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
