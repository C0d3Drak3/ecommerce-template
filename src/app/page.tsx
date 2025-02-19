//import Image from "next/image";
// app/page.tsx
"use client";

import { useState } from "react";
import Wellcoming from "@/components/Wellcoming";
import CardContainer from "@/components/CardContainer";

const Home = async () => {
  // Simulación de fetch de productos
  const products = [
    { id: 1, name: "Producto 1", price: 199.99, imageUrl: "/img1.jpg" },
    { id: 2, name: "Producto 2", price: 299.99, imageUrl: "/img2.jpg" },
  ];

  const [searching, setSearching] = useState(false);

  return (
    <div className="p-8">
      <div className="h-10 bg-slate-500">ESTE DIV SERAN LOS FILTROS</div>
      {searching ? (
        <div className="h-10 bg-slate-500">
          <CardContainer products={products} />
        </div>
      ) : (
        <div>
          <Wellcoming />
        </div>
      )}
    </div>
  );
};

export default Home;
