import OrderRepository from "../repository/OrderRepository";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class GetOrder {
  orderRepository: OrderRepository;

  constructor(repositoryFactory: RepositoryFactory) {
    this.orderRepository = repositoryFactory.createOrderRepository();
  }

  async execute(idOrder: string): Promise<Output> {
    const order = await this.orderRepository.get(idOrder);
    return {
      total: order.getTotal(),
      code: order.code
    };
  }

}

type Output = {
  total: number;
  code: string;
}