import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Rutas que requieren autenticación
const protectedRoutes = ['/cart', '/account', '/admin'];

// Rutas que requieren rol de administrador
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  console.log('Middleware ejecutándose para:', request.nextUrl.pathname);
  
  // Obtener token del header de cookie
  const cookieHeader = request.headers.get('cookie');
  const token = cookieHeader?.split(';')
    .find(c => c.trim().startsWith('auth_token='))
    ?.split('=')?.[1];

  console.log('Token encontrado en middleware:', !!token);
  const path = request.nextUrl.pathname;

  // Verificar si la ruta requiere autenticación o es de administración
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute || isAdminRoute) {
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
      
      // Si es una ruta de administración, verificar el rol en la base de datos
      if (isAdminRoute) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId as number },
          select: { role: true }
        });
        
        if (!user || user.role !== 'ADMIN') {
          console.log('Acceso denegado: se requiere rol de administrador');
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
      
      // Si el token es válido y tiene los permisos necesarios, permitir el acceso
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
  matcher: ['/cart/:path*', '/account/:path*', '/admin/:path*']
};
