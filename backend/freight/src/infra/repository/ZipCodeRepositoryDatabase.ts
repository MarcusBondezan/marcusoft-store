import ZipCodeRepository from "../../application/repository/ZipCodeRepository";
import ZipCode from "../../domain/entity/ZipCode";
import DatabaseConnection from "../database/DabaseConnection";

export default class ZipCodeRepositoryDatabase implements ZipCodeRepository {
  constructor(readonly connection: DatabaseConnection) {

  }

  async get(code: string): Promise<ZipCode | undefined> {
    const [zipCodeData] = await this.connection.query('select * from zipcode where code = $1', [code]);
    if (!zipCodeData) return;
    return new ZipCode(zipCodeData.code, parseFloat(zipCodeData.lat), parseFloat(zipCodeData.long));
  }
  
}