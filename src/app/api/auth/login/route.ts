import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    console.log('Recibiendo solicitud de login...');
    const { email, password } = await request.json();
    console.log('Email recibido:', email);

    // Validar datos
    if (!email || !password) {
      console.log('Faltan datos requeridos');
      return NextResponse.json({
        success: false,
        message: 'Email y contraseña son requeridos'
      }, { status: 400 });
    }

    // Buscar usuario
    console.log('Buscando usuario en la base de datos...');
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('Usuario no encontrado');
      return NextResponse.json({
        success: false,
        message: 'Credenciales inválidas'
      }, { status: 401 });
    }

    // Verificar contraseña
    console.log('Verificando contraseña...');
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Contraseña incorrecta');
      return NextResponse.json({
        success: false,
        message: 'Credenciales inválidas'
      }, { status: 401 });
    }

    // Generar token
    console.log('Generando token...');
    const encoder = new TextEncoder();
    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(encoder.encode(JWT_SECRET));

    // Establecer cookie y crear respuesta
    console.log('Estableciendo cookie...');
    const response = new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      }
    });

    console.log('Login exitoso');
    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al iniciar sesión'
    }, { status: 500 });
  }
}
