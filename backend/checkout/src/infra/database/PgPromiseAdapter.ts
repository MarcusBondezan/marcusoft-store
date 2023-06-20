import DatabaseConnection from "./DabaseConnection";
import pgp from "pg-promise";

export default class PgPromiseAdapter implements DatabaseConnection {
  private connection: any;

  async connect(): Promise<void> {
    this.connection = pgp()('postgres://marcusoft_admin:123456@localhost:5432/marcusoft');
  }
  
  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
  
}