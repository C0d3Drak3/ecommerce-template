import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Esperamos a que los parámetros estén disponibles
    const { id } = await Promise.resolve(params);
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, message: 'ID inválido' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Mapear el producto y validar las URLs de las imágenes
    const mappedProduct = {
      ...product,
      thumbnailUrl: product.thumbnail,
      // Validar que la URL de la imagen sea válida
      imageUrl: product.imageUrl.startsWith('http') ? product.imageUrl : null
    };

    return NextResponse.json({ success: true, product: mappedProduct });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}
