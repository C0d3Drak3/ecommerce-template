import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getCurrentUser() {
  try {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(token, JWT_SECRET) as { userId: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });



    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}
