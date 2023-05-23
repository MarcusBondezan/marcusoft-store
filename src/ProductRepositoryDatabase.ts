import { prisma } from './prisma-client';
import ProductRepository from './ProductRepository';
import Product from './Product';

export default class ProductRepositoryDatabase implements ProductRepository {
  async get (idProduct: number): Promise<Product | null> {
    const prismaProduct = await prisma.product.findUnique({ where: { id: idProduct}});

    if (!prismaProduct) return null;

    return new Product(
      prismaProduct.id,
      prismaProduct.description,
      Number(prismaProduct.price),
      Number(prismaProduct.width),
      Number(prismaProduct.height),
      Number(prismaProduct.length),
      Number(prismaProduct.weight)
    );
  }
}