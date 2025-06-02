import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware para verificar admin
async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.split(';')
    .find(c => c.trim().startsWith('auth_token='))
    ?.split('=')?.[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return null;
    }

    return decoded.userId;
  } catch {
    return null;
  }
}

// GET - Obtener un producto por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Producto no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error getting product:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al obtener el producto'
    }, { status: 500 });
  }
}
