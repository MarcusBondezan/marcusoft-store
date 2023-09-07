import Checkout from "../../application/usecase/Checkout";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GatewayFactory from "../../application/factory/GatewayFactory";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly gatewayFactory: GatewayFactory) {}

  createCheckout(): Checkout {
    return new Checkout(this.repositoryFactory, this.gatewayFactory);
  }

}