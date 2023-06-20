import Checkout from "../../application/usecase/Checkout";
import CsvPresenter from "../presenter/CsvPresenter";
import GetProducts from "../../application/usecase/GetProducts";
import JsonPresenter from "../presenter/JsonPresenter";
import Presenter from "../presenter/Presenter";
import RepositoryFactory from "../../application/factory/RepositoryFactory";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory) {}

  createCheckout(): Checkout {
    return new Checkout(this.repositoryFactory);
  }

  createGetProducts(contentType: string): GetProducts {
    if (contentType === 'text/csv') {
      return new GetProducts(this.repositoryFactory, new CsvPresenter());
    }
    return new GetProducts(this.repositoryFactory, new JsonPresenter());
  }
}