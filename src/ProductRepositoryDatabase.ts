import ProductRepository from './ProductRepository';
import Product from './Product';
import DatabaseConnection from './DabaseConnection';

export default class ProductRepositoryDatabase implements ProductRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async get (idProduct: number): Promise<Product | null> {
    const [productData] = await this.connection.query('select * from product where id = $1', [idProduct]);

    if (!productData) return null;

    return new Product(
      productData.id,
      productData.description,
      Number(productData.price),
      Number(productData.width),
      Number(productData.height),
      Number(productData.length),
      Number(productData.weight)
    );
  }
}