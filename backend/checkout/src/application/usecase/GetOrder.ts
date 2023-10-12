import OrderRepository from "../repository/OrderRepository";
import RepositoryFactory from "../factory/RepositoryFactory";
import GatewayFactory from "../factory/GatewayFactory";
import AuthGateway from "../gateway/AuthGateway";

export default class GetOrder {
  orderRepository: OrderRepository;
  authGateway: AuthGateway;

  constructor(repositoryFactory: RepositoryFactory, gatewayFactory: GatewayFactory) {
    this.orderRepository = repositoryFactory.createOrderRepository();
    this.authGateway = gatewayFactory.createAuthGateway();
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