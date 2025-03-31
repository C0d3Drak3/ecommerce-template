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
    console.log(`✅ Productos encontrados: ${products.length}`);
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('❌ Error detallado:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los productos', error: String(error) },
      { status: 500 }
    );
  }
}
