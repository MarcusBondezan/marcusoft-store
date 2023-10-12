import RepositoryFactory from "../../application/factory/RepositoryFactory";
import Verify from "../../application/usecase/Verify";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory) {}

  createVerify(): Verify {
    return new Verify();
  }
}