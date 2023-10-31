import StockEntryRepository from '../../application/repository/StockEntryRepository';
import StockEntry from '../../domain/entity/StockEntry';
import DatabaseConnection from '../database/DabaseConnection';

// Interface Adapter
export default class StockEntryRepositoryDatabase implements StockEntryRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async save(stockEntry: StockEntry): Promise<void> {
    await this.connection.query('insert into stock_entry (id_product, operation, quantity) values ($1, $2, $3)', [stockEntry.idProduct, stockEntry.operation, stockEntry.quantity]);
  }

  async getStockEntries(idProduct: number): Promise<StockEntry[]> {
    const stockEntriesData = await this.connection.query('select * from stock_entry where id_product = $1', [idProduct]);
    const stockEntries = [];
    for (const stockEntryData of stockEntriesData) {
      stockEntries.push(new StockEntry(stockEntryData.id_product, stockEntryData.operation, stockEntryData.quantity));
    }
    return stockEntries;
  }

  async clean(idProduct: number): Promise<void> {
    await this.connection.query('delete from stock_entry where id_product = $1', [idProduct]);
  }
  
}