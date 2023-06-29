import Order from "../entity/Order";
import Product from "../entity/Product";

export default interface CheckoutGateway {
  getProducts(): Promise<Product[]>;
  checkout(order: Order): Promise<any>;
}