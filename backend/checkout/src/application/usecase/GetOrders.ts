import OrderRepository from "../repository/OrderRepository";
import RepositoryFactory from "../factory/RepositoryFactory";
import GatewayFactory from "../factory/GatewayFactory";
import CatalogGateway from "../gateway/CatalogGateway";

export default class GetOrders {
  orderRepository: OrderRepository;
  catalogGateway: CatalogGateway;

  constructor(repositoryFactory: RepositoryFactory, gatewayFactory: GatewayFactory) {
    this.orderRepository = repositoryFactory.createOrderRepository();
    this.catalogGateway = gatewayFactory.createCatalogGateway();
  }

  async execute(): Promise<Output[]> {
    const output: Output[] = [];
    const orders = await this.orderRepository.list();

    for (const order of orders) {
      const orderOutput: Output = {
        idOrder: order.idOrder,
        items: [],
        date: order.date
      };

      for (const item of order.items) {
        const product = await this.catalogGateway.getProduct(item.idProduct);
        orderOutput.items.push({
          description: product.description,
          price: item.price,
          quantity: item.quantity
        });
      }
      output.push(orderOutput);
    }
    return output;
  }

}

type Output = {
  idOrder: string,
  items: { description: string, price: number, quantity: number }[],
  date: Date
}