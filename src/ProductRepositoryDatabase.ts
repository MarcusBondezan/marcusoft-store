import { prisma } from './prisma-client';
import ProductRepository from './ProductRepository';

export default class ProductRepositoryDatabase implements ProductRepository {
  async get (idProduct: number): Promise<any> {
    return prisma.product.findUnique({ where: { id: idProduct}});
  }
}