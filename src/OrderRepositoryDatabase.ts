import { prisma } from './prisma-client';
import { Decimal } from '@prisma/client/runtime';
import OrderRepository from "./OrderRepository";
import Order from './Order';

export default class OrderRepositoryDatabase implements OrderRepository {

  async get(uuid: string): Promise<any> {
    const orderData = await prisma.order.findUnique({ where: { id: uuid }});
    
    if (orderData) {
      return {
        ...orderData,
        total: Number(orderData.total)
      }
    }

    return null;
  }
  
  async save(order: Order): Promise<void> {
    await prisma.order.create({
      data: {
        id: order.idOrder,
        code: order.code,
        cpf: order.cpf.value,
        total: order.getTotal(),
        freight: order.freight,
      }
    });
  }

  async clear(): Promise<void> {
    await prisma.order.deleteMany();
  }

  async count(): Promise<number> {
    return await prisma.order.count();
  }

}