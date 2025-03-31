import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await prisma.product.findMany();
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos' });
  }
}
