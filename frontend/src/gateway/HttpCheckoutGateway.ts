import Order from "../entity/Order";
import Product from "../entity/Product";
import CheckoutGateway from "./CheckoutGateway";
import HttpClient from '../http/HttpClient';

export default class HttpCheckoutGateway implements CheckoutGateway {

  constructor(readonly httpClient: HttpClient) {}

  async getProducts(): Promise<Product[]> {
    const productsData = await this.httpClient.get("http://localhost:3001/products");
    const products: Product[] = [];

    for(const productData of productsData) {
      products.push(new Product(productData.id, productData.description, productData.price));
    }

    return products;
  }

  async checkout(order: Order): Promise<any> {
    return this.httpClient.post("http://localhost:3001/checkout", order);
  }

}