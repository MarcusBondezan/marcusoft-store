import Presenter from "../../infra/presenter/Presenter";
import ProductRepository from "../repository/ProductRepository";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class GetProduct {
  productRepository: ProductRepository;

  constructor(repositoryFactory: RepositoryFactory) {
    this.productRepository = repositoryFactory.createProductRepository();
  }

  async execute(productId: number): Promise<Output> {
    const product = await this.productRepository.get(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    return {
      id: product.id,
      description: product.description,
      price: product.price,
      height: product.height,
      width: product.width,
      length: product.length,
      weight: product.weight,
      volume: product.getVolume(),
      density: product.getDensity()
    };
  }
}

type Output = {
  id: number;
  description: string;
  price: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  volume: number;
  density: number;
}