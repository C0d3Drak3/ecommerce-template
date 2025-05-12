import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Intentando obtener productos...');
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    
    // Mapear los productos para convertir el campo thumbnail a thumbnailUrl
    const mappedProducts = products.map(product => ({
      ...product,
      thumbnailUrl: product.thumbnail
    }));
    console.log(`✅ Productos encontrados: ${products.length}`);
    return NextResponse.json({ success: true, products: mappedProducts });
  } catch (error) {
    console.error('❌ Error detallado:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los productos', error: String(error) },
      { status: 500 }
    );
  }
}
