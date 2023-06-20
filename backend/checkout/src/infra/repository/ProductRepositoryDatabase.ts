import ProductRepository from '../../application/repository/ProductRepository';
import Product from '../../domain/entity/Product';
import DatabaseConnection from '../database/DabaseConnection';

// Interface Adapter
export default class ProductRepositoryDatabase implements ProductRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async list(): Promise<Product[]> {
    const productsData = await this.connection.query('select * from product', []);
    const products: Product[] = [];

    for (const productData of productsData) {
      products.push(new Product(
        productData.id,
        productData.description,
        Number(productData.price),
        Number(productData.width),
        Number(productData.height),
        Number(productData.length),
        Number(productData.weight)
      ));
    }

    return products;
  }

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