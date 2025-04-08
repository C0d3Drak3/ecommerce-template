import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validar datos
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Todos los campos son requeridos'
      }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'El email ya está registrado'
      }, { status: 400 });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario registrado exitosamente'
    });

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al registrar usuario'
    }, { status: 500 });
  }
}
