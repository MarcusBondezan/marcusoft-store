import RepositoryFactory from "../../application/factory/RepositoryFactory";

export default class UseCaseFactory {
  constructor(readonly repositoryFactory: RepositoryFactory) {}
}