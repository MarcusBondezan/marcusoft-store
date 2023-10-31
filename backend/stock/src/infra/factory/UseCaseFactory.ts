import RepositoryFactory from "../../application/factory/RepositoryFactory";
import DecreaseStock from "../../application/usecase/DecreaseStock";
import GetStock from "../../application/usecase/GetStock";
import CleanStock from "../../application/usecase/CleanStock";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory) {}

  createDecreaseStock(): DecreaseStock {
    return new DecreaseStock(this.repositoryFactory);
  }

  createGetStock(): GetStock {
    return new GetStock(this.repositoryFactory);
  }

  createCleanStock(): CleanStock {
    return new CleanStock(this.repositoryFactory);
  }

}