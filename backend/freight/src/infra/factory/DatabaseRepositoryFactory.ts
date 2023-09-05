import RepositoryFactory from "../../application/factory/RepositoryFactory";
import ZipCodeRepository from "../../application/repository/ZipCodeRepository";
import DatabaseConnection from "../database/DabaseConnection";
import ZipCodeRepositoryDatabase from "../repository/ZipCodeRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

  constructor(readonly connection: DatabaseConnection) {}

  createZipCodeRepository(): ZipCodeRepository {
    return new ZipCodeRepositoryDatabase(this.connection);
  }
  
}