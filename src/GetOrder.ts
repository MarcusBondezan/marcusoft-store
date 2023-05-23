import OrderRepository from "./OrderRepository";

export default class GetOrder {

  constructor(readonly orderRepository: OrderRepository) {}

  async execute(idOrder: string): Promise<Output> {
    const orderData = await this.orderRepository.get(idOrder);
    return orderData;
  }

}

type Output = {
  total: number;
  code: string;
}