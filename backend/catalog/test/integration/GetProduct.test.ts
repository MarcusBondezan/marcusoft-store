import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import GetProduct from "../../src/application/usecase/GetProduct";

describe('GetProduct', () => {
  test('Deve retornar um produto', async () => {
    // framework and driver
    const connection = new PgPromiseAdapter();
    await connection.connect();
    // interface adapter
    const repositoryFactory = new DatabaseRepositoryFactory(connection);
    // application
    const getProduct = new GetProduct(repositoryFactory);
    const output = await getProduct.execute(1);
    expect(output.id).toBe(1);
    expect(output.description).toBe('A');
    expect(output.price).toBe(1000);
    expect(output.width).toBe(100);
    expect(output.height).toBe(30);
    expect(output.length).toBe(10);
    expect(output.weight).toBe(3);
    expect(output.density).toBe(100);
    expect(output.volume).toBe(0.03);
    await connection.close();
  });
});