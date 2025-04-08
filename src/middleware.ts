import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rutas que requieren autenticación
const protectedRoutes = ['/cart', '/account'];

export async function middleware(request: NextRequest) {
  console.log('Middleware ejecutándose para:', request.nextUrl.pathname);
  
  // Obtener token del header de cookie
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.split(';')
    .find(c => c.trim().startsWith('auth_token='))
    ?.split('=')?.[1];

  console.log('Token encontrado en middleware:', !!token);
  const path = request.nextUrl.pathname;

  // Verificar si la ruta requiere autenticación
  if (protectedRoutes.some(route => path.startsWith(route))) {
    if (!token) {
      console.log('No hay token, redirigiendo a login');
      // Redirigir a login si no hay token
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }

    try {
      // Verificar token usando jose
      const encoder = new TextEncoder();
      const { payload } = await jwtVerify(
        token,
        encoder.encode(JWT_SECRET)
      );
      
      console.log('Token válido para usuario:', payload.userId);
      
      // Si el token es válido, permitir el acceso
      const response = NextResponse.next();
      return response;
    } catch (error) {
      console.log('Token inválido:', error);
      // Token inválido, redirigir a login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/account/:path*']
};
