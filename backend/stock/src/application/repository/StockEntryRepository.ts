import StockEntry from "../../domain/entity/StockEntry";

export default interface StockEntryRepository {
  save(stockEntry: StockEntry): Promise<void>;
  getStockEntries(idProduct: number): Promise<StockEntry[]>;
  clean(idProduct: number): Promise<void>;
}