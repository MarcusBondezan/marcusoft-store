import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import GetProducts from "../../src/application/usecase/GetProducts";
import JsonPresenter from "../../src/infra/presenter/JsonPresenter";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";

describe('GetProducts', () => {
  test('Deve listar os produtos', async () => {
    // framework and driver
    const connection = new PgPromiseAdapter();
    await connection.connect();
    // interface adapter
    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    // application
    const getProducts = new GetProducts(repositoryFactory, new JsonPresenter());
    const output = await getProducts.execute();
    expect(output).toHaveLength(3);
    await connection.close();
  });
});