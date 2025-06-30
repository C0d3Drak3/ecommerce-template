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

// DELETE - Eliminar usuario
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const userId = parseInt(params.id);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario no proporcionado' },
        { status: 400 }
      );
    }

    // No permitir que un administrador se elimine a sí mismo
    if (userId === adminId) {
      return NextResponse.json(
        { success: false, message: 'No puedes eliminar tu propia cuenta de administrador' },
        { status: 400 }
      );
    }

    // Primero eliminamos las transacciones del usuario
    await prisma.transaction.deleteMany({
      where: { userId }
    });

    // Luego eliminamos el carrito del usuario
    await prisma.cart.deleteMany({
      where: { userId }
    });

    // Finalmente eliminamos al usuario
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
