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

    console.log('Token encontrado en /cart:', !!token);

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
        items: []
      });
    }

    // Obtener detalles de los productos en el carrito
    const cartItems = cart.items as { productId: number; quantity: number }[];
    const productIds = cartItems.map(item => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    // Combinar información de productos con cantidades
    const items = cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      return {
        ...product,
        quantity: cartItem.quantity
      };
    });

    return NextResponse.json({
      success: true,
      items
    });

  } catch (error) {
    console.error('Error getting cart:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al obtener carrito'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Obtener token del header de cookie
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')?.[1];

    console.log('Token encontrado en POST /cart:', !!token);

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No autenticado'
      }, { status: 401 });
    }

    const { productId, quantity } = await request.json();

    if (!productId || quantity < 1) {
      return NextResponse.json({
        success: false,
        message: 'Datos inválidos'
      }, { status: 400 });
    }

    // Verificar token
    const decoded = verify(token, JWT_SECRET) as { userId: number };

    // Verificar que el producto existe y tiene stock suficiente
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({
        success: false,
        message: 'Producto no encontrado'
      }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({
        success: false,
        message: 'Stock insuficiente'
      }, { status: 400 });
    }

    // Buscar o crear carrito
    let cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: decoded.userId,
          items: []
        }
      });
    }

    // Actualizar items del carrito
    const currentItems = cart.items as { productId: number; quantity: number }[];
    const existingItemIndex = currentItems.findIndex(item => item.productId === productId);

    let newItems;
    if (existingItemIndex >= 0) {
      newItems = [...currentItems];
      newItems[existingItemIndex].quantity = quantity;
    } else {
      newItems = [...currentItems, { productId, quantity }];
    }

    // Actualizar carrito
    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: newItems }
    });

    return NextResponse.json({
      success: true,
      message: 'Carrito actualizado'
    });

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al actualizar carrito'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Obtener token del header de cookie
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith('auth_token='))
      ?.split('=')?.[1];

    console.log('Token encontrado en DELETE /cart:', !!token);

    if (!token) {
      return NextResponse.json({
        success: false,
        message: 'No autenticado'
      }, { status: 401 });
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: 'ID de producto requerido'
      }, { status: 400 });
    }

    // Verificar token
    const decoded = verify(token, JWT_SECRET) as { userId: number };

    // Buscar carrito
    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId }
    });

    if (!cart) {
      return NextResponse.json({
        success: false,
        message: 'Carrito no encontrado'
      }, { status: 404 });
    }

    // Eliminar item del carrito
    const currentItems = cart.items as { productId: number; quantity: number }[];
    const newItems = currentItems.filter(item => item.productId !== productId);

    // Actualizar carrito
    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: newItems }
    });

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado del carrito'
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al eliminar del carrito'
    }, { status: 500 });
  }
}
