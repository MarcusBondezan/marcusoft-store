import CsvPresenter from "../presenter/CsvPresenter";
import GetProducts from "../../application/usecase/GetProducts";
import JsonPresenter from "../presenter/JsonPresenter";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GetProduct from "../../application/usecase/GetProduct";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory) {}

  createGetProducts(contentType: string): GetProducts {
    if (contentType === 'text/csv') {
      return new GetProducts(this.repositoryFactory, new CsvPresenter());
    }
    return new GetProducts(this.repositoryFactory, new JsonPresenter());
  }

  createGetProduct(): GetProduct {
    return new GetProduct(this.repositoryFactory);
  }
}