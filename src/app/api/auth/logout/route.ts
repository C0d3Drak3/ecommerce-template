import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Crear respuesta con cookie expirada
    const response = new Response(JSON.stringify({
      success: true,
      message: 'Sesión cerrada exitosamente'
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
      }
    });

    return response;
  } catch (error) {
    console.error('Error en logout:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al cerrar sesión'
    }, { status: 500 });
  }
}
