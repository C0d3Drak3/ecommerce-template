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

// GET - Obtener todos los productos
export async function GET(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error getting products:', error);
    return NextResponse.json({ success: false, message: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST - Crear nuevo producto
export async function POST(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Validar campos requeridos
    const requiredFields = ['title', 'description', 'imageUrl', 'price', 'stock', 'category', 'thumbnail', 'brand', 'tags'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        category: data.category,
        thumbnail: data.thumbnail,
        brand: data.brand,
        tags: data.tags
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: 'Error al crear producto' }, { status: 500 });
  }
}

// PUT - Actualizar producto
export async function PUT(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID del producto es requerido'
      }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        price: parseFloat(updateData.price),
        stock: parseInt(updateData.stock)
      }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, message: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE - Eliminar producto
export async function DELETE(request: Request) {
  const adminId = await verifyAdmin(request);
  if (!adminId) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID del producto es requerido'
      }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, message: 'Error al eliminar producto' }, { status: 500 });
  }
}
