import Presenter from "../../infra/presenter/Presenter";
import ProductRepository from "../repository/ProductRepository";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class GetProducts {
  productRepository: ProductRepository;

  constructor(repositoryFactory: RepositoryFactory, readonly presenter: Presenter) {
    this.productRepository = repositoryFactory.createProductRepository();
  }

  async execute(): Promise<any> {
    const products = await this.productRepository.list();
    const output: Output[] = [];
    for (const product of products) {
      output.push({
        id: product.id,
        description: product.description,
        price: product.price,
      });
    }
    return this.presenter.present(output);
  }
}

type Output = {
  id: number;
  description: string;
  price: number;
}