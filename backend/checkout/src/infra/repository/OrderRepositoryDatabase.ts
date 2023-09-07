import DatabaseConnection from '../database/DabaseConnection';
import OrderRepository from "../../application/repository/OrderRepository";
import Order from '../../domain/entity/Order';
import Item from '../../domain/entity/Item';

// Repository always returns Aggregates or Aggregate related information
export default class OrderRepositoryDatabase implements OrderRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async get(uuid: string): Promise<Order> {
    const [orderData] = await this.connection.query('select * from "order" where id = $1', [uuid]);
    const order = new Order(orderData.id, orderData.cpf, orderData.date, orderData.sequence);

    const itemsData = await this.connection.query('select * from "item" where id_order = $1', [uuid]);

    for (const itemData of itemsData) {
      const item = new Item(itemData.id_product, itemData.price, itemData.quantity);
      order.items.push(item);
    }

    return order;
  }
  
  async save(order: Order): Promise<void> {
    await this.connection.query('insert into "order" (id, code, cpf, total, freight, date, sequence) values ($1, $2, $3, $4, $5, $6, $7)', [
      order.idOrder, 
      order.code, 
      order.cpf.value,
      order.getTotal(),
      order.freight,
      order.date,
      order.sequence
    ]);
    for (const item of order.items) {
			await this.connection.query('insert into "item" (id_order, id_product, price, quantity) values ($1, $2, $3, $4)', [order.idOrder, item.idProduct, item.price, item.quantity]);
		}
  }

  async clear(): Promise<void> {
    await this.connection.query('delete from "item"', []);
    await this.connection.query('delete from "order"', []);
  }

  async count(): Promise<number> {
    const [result] = await this.connection.query('select count(*)::integer from "order"', []);
    return result.count;
  }

}