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

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No autenticado'
      }, { status: 401 });
    }

    // Verificar token
    const decoded = verify(token, JWT_SECRET) as { userId: number };

    // Obtener transacciones del usuario ordenadas por fecha descendente
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: decoded.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      transactions
    });

  } catch (error) {
    console.error('Error getting transactions:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al obtener el historial de compras'
    }, { status: 500 });
  }
}
