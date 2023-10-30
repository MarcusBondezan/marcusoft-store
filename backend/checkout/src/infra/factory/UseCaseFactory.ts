import Checkout from "../../application/usecase/Checkout";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GatewayFactory from "../../application/factory/GatewayFactory";
import GetOrder from "../../application/usecase/GetOrder";
import AuthDecorator from "../../application/decorator/AuthDecorator";
import UseCase from "../../application/usecase/UseCase";
import LogDecorator from "../../application/decorator/LogDecorator";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory, readonly gatewayFactory: GatewayFactory) {}

  createCheckout(): UseCase {
    return new LogDecorator(new AuthDecorator(new Checkout(this.repositoryFactory, this.gatewayFactory), this.gatewayFactory));
  }

  createGetOrder(): GetOrder {
    return new GetOrder(this.repositoryFactory, this.gatewayFactory);
  }

}