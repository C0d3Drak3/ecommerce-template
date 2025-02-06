import {PrismaClient} from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function seedProducts() {

    try {
    const filePath= 'products.json';

    if(!fs.existsSync(filePath)) {
        console.error(`❌ Archivo ${filePath} no encontrado.`);
        return;


    }
    const products= JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const existingCount= await prisma.product.count();

     if (existingCount===0){
       await prisma.product.createMany({
        data:products,
     });
     console.log('📦 Productos insertados correctamente.');
    }
    else {
        console.log('✅ Los productos ya estaban cargados.');
    }

} catch (error) {
    console.error('❌ Error al insertar productos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();

