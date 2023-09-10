import DatabaseConnection from "../database/DabaseConnection";
import RepositoryFactory from "../../application/factory/RepositoryFactory";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

  constructor(readonly connection: DatabaseConnection) {}
  
}