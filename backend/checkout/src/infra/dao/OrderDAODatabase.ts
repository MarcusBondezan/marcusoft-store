import OrderDAO from "../../application/dao/OrderDAO";
import DatabaseConnection from "../database/DabaseConnection";

export default class OrderDAODatabase implements OrderDAO {

  constructor(readonly connection: DatabaseConnection) {}

  async list(): Promise<any> {
    const ordersData = await this.connection.query('select * from "order"', []);

    console.log(ordersData)
    for (const orderData of ordersData) {
      orderData.items = await this.connection.query('select * from "item" join "product" on (item.id_product = product.id) where id_order = $1', [orderData.id]);
    }

    return ordersData;
  }
  
}