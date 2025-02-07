// src/prisma/seed.ts
import { prisma } from '../lib/prisma';
import fs from "fs";
import path from "path";


// Define una interfaz para tipar los datos que vienen del JSON
interface ProductData {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  tags: string[];
  brand: string;
  thumbnail: string;
  images: string[];
}

// Función principal para insertar productos en la base de datos
async function main() {
  try {
    const filePath = path.join(__dirname, "products.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const { products } = JSON.parse(jsonData) as { products: ProductData[] };

    for (const product of products) {
     
      await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          imageUrl: product.images && product.images.length > 0 ? product.images[0] : "",
          price: product.price,
          stock: product.stock,
          category: product.category,
          thumbnail: product.thumbnail,
          brand: product.brand,
          tags: product.tags
        },
      });
    }
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
