import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    // Obtener token del header de cookie
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')?.[1];

    console.log('Token encontrado en /cart/count:', !!token);

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No autenticado'
      }, { status: 401 });
    }

    // Verificar token
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    console.log('Usuario verificado:', decoded.userId);
    
    // Buscar carrito del usuario
    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId }
    });
    
    console.log('Carrito encontrado:', !!cart);

    if (!cart) {
      return NextResponse.json({
        success: true,
        count: 0
      });
    }

    // Calcular cantidad total de items en el carrito
    const items = cart.items as { productId: number; quantity: number }[];
    const count = items.reduce((acc, item) => acc + item.quantity, 0);

    return NextResponse.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Error getting cart count:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al obtener cantidad del carrito'
    }, { status: 500 });
  }
}
