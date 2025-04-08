import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    console.log('Verificando autenticación en el servidor...');
    
    // Obtener token del header de cookie
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')?.[1];

    console.log('Token encontrado:', !!token);

    if (!token) {
      console.log('No hay token');
      return NextResponse.json({
        success: false,
        message: 'No autenticado'
      }, { status: 401 });
    }

    // Verificar token
    console.log('Verificando token...');
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      token,
      encoder.encode(JWT_SECRET)
    );
    console.log('Token válido para usuario:', payload.userId);
    
    // Buscar usuario
    console.log('Buscando usuario en la base de datos...');
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      console.log('Usuario no encontrado en la base de datos');
      const response = NextResponse.json({
        success: false,
        message: 'Usuario no encontrado'
      }, { status: 404 });
      
      response.cookies.delete('auth_token');
      return response;
    }

    console.log('Usuario autenticado:', user);
    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al verificar autenticación'
    }, { status: 500 });
  }
}
