import DatabaseConnection from '../database/DabaseConnection';
import OrderRepository from "../../application/repository/OrderRepository";
import Order from '../../domain/entity/Order';

export default class OrderRepositoryDatabase implements OrderRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async get(uuid: string): Promise<any> {
    const [orderData] = await this.connection.query('select * from "order" where id = $1', [uuid]);
    
    if (orderData) {
      return {
        ...orderData,
        total: Number(orderData.total)
      }
    }

    return null;
  }
  
  async save(order: Order): Promise<void> {
    await this.connection.query('insert into "order" (id, code, cpf, total, freight) values ($1, $2, $3, $4, $5)', [
      order.idOrder, 
      order.code, 
      order.cpf.value,
      order.getTotal(),
      order.freight
    ]);
  }

  async clear(): Promise<void> {
    await this.connection.query('delete from "order"', []);
  }

  async count(): Promise<number> {
    const [result] = await this.connection.query('select count(*)::integer from "order"', []);
    return result.count;
  }

}