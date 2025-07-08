import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('exclude');
    const tagsParam = searchParams.get('tags');
    const category = searchParams.get('category');
    
    if (!excludeId) {
      return NextResponse.json(
        { success: false, message: 'Falta el parámetro requerido: exclude' },
        { status: 400 }
      );
    }

    const excludeIdNum = parseInt(excludeId);
    let products: any[] = [];
    
    // Si hay tags, buscar por tags primero
    if (tagsParam) {
      const tags = tagsParam.split(',');
      const relatedByTags = await prisma.product.findMany({
        where: {
          id: { not: excludeIdNum },
          tags: { hasSome: tags },
          imageUrl: { not: '' },
          thumbnail: { not: '' }
        },
        select: {
          id: true,
          title: true,
          price: true,
          discountPercentage: true,
          imageUrl: true,
          thumbnail: true,
          category: true,
          tags: true
        },
        take: 4,
      });
      
      products = relatedByTags;
    }
    
    // Si no encontramos suficientes productos por tags y tenemos categoría, buscar por categoría
    if (products.length < 4 && category) {
      const needed = 4 - products.length;
      const excludeIds = [excludeIdNum, ...products.map(p => p.id)];
      
      const relatedByCategory = await prisma.product.findMany({
        where: {
          id: { notIn: excludeIds },
          category: category,
          imageUrl: { not: '' },
          thumbnail: { not: '' }
        },
        select: {
          id: true,
          title: true,
          price: true,
          discountPercentage: true,
          imageUrl: true,
          thumbnail: true,
          category: true,
          tags: true
        },
        take: needed,
      });
      
      products = [...products, ...relatedByCategory];
    }

    return NextResponse.json({
      success: true,
      products: products.slice(0, 4) // Asegurar máximo 4 productos
    });
    
  } catch (error) {
    console.error('Error al obtener productos relacionados:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al obtener productos relacionados',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
