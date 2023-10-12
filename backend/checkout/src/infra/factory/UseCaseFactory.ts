import Checkout from "../../application/usecase/Checkout";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GatewayFactory from "../../application/factory/GatewayFactory";
import GetOrder from "../../application/usecase/GetOrder";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly gatewayFactory: GatewayFactory) {}

  createCheckout(): Checkout {
    return new Checkout(this.repositoryFactory, this.gatewayFactory);
  }

  createGetOrder(): GetOrder {
    return new GetOrder(this.repositoryFactory);
  }

}