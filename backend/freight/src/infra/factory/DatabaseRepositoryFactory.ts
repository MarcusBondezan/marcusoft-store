import RepositoryFactory from "../../application/factory/RepositoryFactory";
import DatabaseConnection from "../database/DabaseConnection";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

  constructor(readonly connection: DatabaseConnection) {}
  
}