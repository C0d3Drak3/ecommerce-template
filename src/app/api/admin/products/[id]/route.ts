import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware para verificar admin
async function verifyAdmin(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      console.log('No se encontró la cabecera de cookies');
      return null;
    }

    const token = cookieHeader.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')?.[1]?.trim();

    if (!token) {
      console.log('No se encontró el token en las cookies');
      return null;
    }

    console.log('Token encontrado, verificando...');
    const decoded = verify(token, JWT_SECRET) as { userId: number };
    
    if (!decoded?.userId) {
      console.log('Token inválido o sin userId');
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true }
    });

    if (!user) {
      console.log('Usuario no encontrado');
      return null;
    }

    if (user.role !== 'ADMIN') {
      console.log('Usuario no es administrador');
      return null;
    }

    console.log('Usuario autenticado como administrador');
    return decoded.userId;
  } catch (error) {
    console.error('Error en verifyAdmin:', error);
    return null;
  }
}

// GET - Obtener un producto por ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  // Esperar a que los parámetros estén disponibles
  const { id } = await Promise.resolve(context.params);
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
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

// PUT - Actualizar producto
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  // Esperar a que los parámetros estén disponibles
  const { id } = await Promise.resolve(context.params);
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error al analizar el cuerpo de la solicitud:', parseError);
      return NextResponse.json(
        { success: false, message: 'Formato de solicitud inválido' }, 
        { status: 400 }
      );
    }
    
    // Validar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' }, 
        { status: 404 }
      );
    }

    // Validar que hay datos para actualizar
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionaron datos para actualizar' },
        { status: 400 }
      );
    }

    // Preparar los datos a actualizar
    const updateData: any = {};
    
    // Solo actualizar los campos que vienen en el body
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock, 10);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.discount !== undefined) {
      const discountValue = parseInt(body.discount, 10);
      updateData.discountPercentage = Math.max(0, Math.min(100, isNaN(discountValue) ? 0 : discountValue));
    }

    console.log('Datos a actualizar:', updateData);
    
    // Validar que hay datos para actualizar
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No se proporcionaron datos para actualizar' },
        { status: 400 }
      );
    }

    console.log('Datos a actualizar:', updateData);
    
    try {
      // Actualizar el producto
      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(id) },
        data: updateData,
      });

      console.log('Producto actualizado correctamente:', updatedProduct);
      return NextResponse.json({ 
        success: true, 
        product: updatedProduct 
      });
    } catch (prismaError: any) {
      console.error('Error de Prisma al actualizar el producto:');
      console.error('Código:', prismaError.code);
      console.error('Mensaje:', prismaError.message);
      console.error('Meta:', prismaError.meta);
      
      return NextResponse.json({
        success: false,
        message: 'Error de validación de datos',
        error: prismaError.message,
        code: prismaError.code,
        ...(process.env.NODE_ENV === 'development' && { meta: prismaError.meta })
      }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('Error inesperado al actualizar el producto:');
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Mensaje:', errorMessage);
    console.error('Stack:', errorStack);
    console.error('Error completo:', JSON.stringify(error, null, 2));
    
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno del servidor al actualizar el producto',
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
    }, { status: 500 });
  }
}
