import Order from "../../domain/entity/Order";

export default interface OrderRepository {
  get(idOrder: string): Promise<Order>;
  list(): Promise<Order[]>;
  save(order: Order): Promise<void>;
  clear(): Promise<void>;
  count(): Promise<number>;
}