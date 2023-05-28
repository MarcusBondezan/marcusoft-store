import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import SimulateFreight from "../src/SimulateFreight";

test('Deve simular o frete', async function() {
  const input = {
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 }
    ],
    from: '88015600',
    to: '22030060'
  };

  const repositoryFactory = new DatabaseRepositoryFactory();
  const simulateFreight = new SimulateFreight(repositoryFactory);
  const output = await simulateFreight.execute(input);
  expect(output.freight).toBe(280);
});