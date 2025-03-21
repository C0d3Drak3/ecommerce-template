import { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';

export default async function products(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await Prisma.product.findMany();
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los productos' });
  }
}

