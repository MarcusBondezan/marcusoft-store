import DatabaseConnection from "../database/DabaseConnection";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import StockEntryRepositoryDatabase from "../repository/StockEntryRepositoryDatabase";
import StockEntryRepository from "../../application/repository/StockEntryRepository";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

  constructor(readonly connection: DatabaseConnection) {}

  createStockEntryRepository(): StockEntryRepository {
    return new StockEntryRepositoryDatabase(this.connection);
  }
  
}