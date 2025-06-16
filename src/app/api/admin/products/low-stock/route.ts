import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Umbral de stock bajo (puedes ajustar este valor según necesites)
const LOW_STOCK_THRESHOLD = 10;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    // TEMPORAL: Deshabilitar verificación de autenticación para pruebas
    console.log('Endpoint /api/admin/products/low-stock accedido');
    
    // TEMPORAL: Comentar la verificación de token
    /*
    const cookieHeader = request.headers.get('cookie') || '';
    const token = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
    
    if ((payload as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      );
    }
    */

    try {
      const lowStockProducts = await prisma.product.findMany({
        where: {
          stock: {
            lte: LOW_STOCK_THRESHOLD, // Productos con stock menor o igual al umbral
            gt: 0 // Pero mayor que 0 (para no incluir productos agotados)
          }
        },
        orderBy: {
          stock: 'asc' // Ordenar por stock de menor a mayor
        },
        select: {
          id: true,
          title: true,
          stock: true,
          price: true,
          category: true,
          thumbnail: true
        }
      });

      return NextResponse.json({ products: lowStockProducts });
    } catch (error) {
      console.error('Error al obtener productos con stock bajo:', error);
      return NextResponse.json(
        { error: 'Error al obtener productos con stock bajo' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json(
      { error: 'Error de autenticación' },
      { status: 500 }
    );
  }
}
