import CouponRepository from '../repository/CouponRepository';
import OrderRepository from '../repository/OrderRepository';
import Order from '../../domain/entity/Order';
import RepositoryFactory from '../factory/RepositoryFactory';
import GatewayFactory from '../factory/GatewayFactory';
import CatalogGateway from '../gateway/CatalogGateway';
import FreightGateway from '../gateway/FreightGateway';
import AuthGateway from '../gateway/AuthGateway';
import UseCase from './UseCase';
import StockGateway from '../gateway/StockGateway';
import Queue from '../../infra/queue/Queue';

export default class Checkout implements UseCase {
  orderRepository: OrderRepository;
  couponRepository: CouponRepository;
  catalogGateway: CatalogGateway;
  freightGateway: FreightGateway;
  authGateway: AuthGateway;
  stockGateway: StockGateway;

  constructor(repositoryFactory: RepositoryFactory, gatewayFactory: GatewayFactory, readonly queue?: Queue) {
    this.orderRepository = repositoryFactory.createOrderRepository();
    this.couponRepository = repositoryFactory.createCouponRepository();
    this.catalogGateway = gatewayFactory.createCatalogGateway();
    this.freightGateway = gatewayFactory.createFreightGateway();
    this.authGateway = gatewayFactory.createAuthGateway();
    this.stockGateway = gatewayFactory.createStockGateway();
  }

  async execute(input: Input): Promise<Output> {
    const sequence = await this.orderRepository.count();
    const order = new Order(input.idOrder, input.cpf, input.date, sequence + 1);
    const inputFreight: any = {
      items: [],
      from: input.from,
      to: input.to,
    };

    for (const item of input.items) {
      const product = await this.catalogGateway.getProduct(item.id);

      if (product) {
        order.addItem(product, item.quantity);        
        inputFreight.items.push({
          volume: product.volume,
          density: product.density,
          quantity: item.quantity,
        });
      }
    }

    if (input.from && input.to) {
      const output = await this.freightGateway.simulateFreight(inputFreight);
      order.freight = output.freight;
    }
    
    if (input.coupon) {
      const coupon = await this.couponRepository.get(input.coupon);
      if (coupon) {
        order.addCoupon(coupon);
      }
    }

    await this.orderRepository.save(order);
    
    if(this.queue) {
      await this.queue.publish('orderPlaced', order);
    }

    return {
      freight: order.freight,
      total: order.getTotal(),
    };
  }
}

type Input = {
  idOrder: string,
  cpf: string,
  items: {
    id: number,
    quantity: number,
  }[],
  date?: Date, 
  coupon?: string,
  from?: string,
  to?: string,
  token?: string,
}

type Output = {
  total: number,
  freight: number,
}