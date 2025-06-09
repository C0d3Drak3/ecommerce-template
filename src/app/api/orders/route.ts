import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
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

    // Obtener el carrito del usuario
    const cart = await prisma.cart.findUnique({
      where: { userId: decoded.userId },
      include: {
        user: true
      }
    });

    if (!cart || !cart.items) {
      return NextResponse.json({
        success: false,
        message: 'Carrito no encontrado'
      }, { status: 404 });
    }

    // Obtener los items del carrito
    const cartItems = cart.items as { productId: number; quantity: number }[];
    const productIds = cartItems.map(item => item.productId);

    // Obtener los productos con su stock actual
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        title: true,
        price: true,
        discountPercentage: true,
        imageUrl: true,
        thumbnail: true,
        stock: true
      }
    });

    // Verificar stock disponible
    for (const cartItem of cartItems) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) {
        throw new Error(`Producto con ID ${cartItem.productId} no encontrado`);
      }
      if ((product.stock || 0) < cartItem.quantity) {
        return NextResponse.json({
          success: false,
          message: `No hay suficiente stock para el producto: ${product.title}`
        }, { status: 400 });
      }
    }

    // Calcular el total y crear el objeto de items para la transacción
    const items = cartItems.map(cartItem => {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) throw new Error('Producto no encontrado');
      
      const price = product.discountPercentage && product.discountPercentage > 0
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
      
      const subtotal = price * cartItem.quantity;
      
      return {
        id: product.id,
        title: product.title,
        price: product.price, // Precio original
        discountPercentage: product.discountPercentage || 0,
        discountedPrice: price, // Precio con descuento aplicado
        quantity: cartItem.quantity,
        thumbnail: product.thumbnail,
        subtotal: subtotal
      };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Crear la transacción
    const transaction = await prisma.transaction.create({
      data: {
        userId: decoded.userId,
        items: items,
        total: total
      }
    });

    // Actualizar el stock de los productos
    for (const cartItem of cartItems) {
      await prisma.product.update({
        where: { id: cartItem.productId },
        data: {
          stock: {
            decrement: cartItem.quantity
          }
        }
      });
    }

    // Limpiar el carrito
    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: [] }
    });

    return NextResponse.json({
      success: true,
      transaction
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al procesar el pedido'
    }, { status: 500 });
  }
}
