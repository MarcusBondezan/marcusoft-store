import axios from 'axios';
import sinon from 'sinon';
import crypto from 'crypto';
import Checkout from '../../src/application/usecase/Checkout';
import GetOrder from '../../src/application/usecase/GetOrder';
import Product from '../../src/domain/entity/Product';
import DatabaseRepositoryFactory from '../../src/infra/factory/DatabaseRepositoryFactory';
import RepositoryFactory from '../../src/application/factory/RepositoryFactory';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import DatabaseConnection from '../../src/infra/database/DabaseConnection';
import AxiosAdapter from '../../src/infra/http/AxiosAdapter';
import GatewayHttpFactory from '../../src/infra/factory/GatewayHttpFactory';
import UseCaseFactory from '../../src/infra/factory/UseCaseFactory';
import CatalogHttpGateway from '../../src/infra/gateway/CatalogHttpGateway';

axios.defaults.validateStatus = function () {
  return true;
}

let checkout: Checkout;
let getOrder: GetOrder;
let repositoryFactory: RepositoryFactory;
let connection: DatabaseConnection;

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  await connection.connect();
  repositoryFactory = new DatabaseRepositoryFactory(connection);
  const httpClient = new AxiosAdapter();
  const gatewayFactory = new GatewayHttpFactory(httpClient);
  checkout = new Checkout(repositoryFactory, gatewayFactory);
  getOrder = new GetOrder(repositoryFactory, gatewayFactory);
});

afterEach(async () => {
  await connection.close();
});

test('Não deve criar um pedido com CPF inválido', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '378.299.138-88',
    items: []
  };

  await expect(() => checkout.execute(input)).rejects.toThrow(new Error('CPF Inválido'));
});

test('Não deve fazer um pedido com quantidade negativa de item', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: -1 },
    ]
  };

  await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Quantidade inválida'));
});

test('Não deve ser possível fazer pedido com itens duplicados', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 1, quantity: 1 },
    ]
  };

  await expect(() => checkout.execute(input)).rejects.toThrow(new Error('Item duplicado'));
});

test('Deve criar um pedido com 3 produtos e calcular o valor total', async function () {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
      { id: 3, quantity: 1 }
    ]
  };

  const output = await checkout.execute(input);

  expect(output.total).toBe(11030);
});

test('Deve criar um pedido com 1 item com stub', async function () {
  const catalogGatewayStub = sinon.stub(CatalogHttpGateway.prototype, 'getProduct').resolves(new Product(1, 'A', 100, 1, 1, 1, 1, 0.03, 100));
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
    ]
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(100);
  catalogGatewayStub.restore();
});

test('Deve criar um pedido com 3 produtos, associar um cupom válido e calcular o total (percentual sobre o total do pedido)', async function () {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    coupon: 'VALE20',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
      { id: 3, quantity: 1 }
    ]
  };

  const output = await checkout.execute(input);

  expect(output.total).toBe(8824);
});

test('Deve fazer um pedido com 2 itens calculando o frete', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
    ],
    from: '22060030',
    to: '88015600'
  };

  const output = await checkout.execute(input);

  expect(output.freight).toBe(187.05544450204079);
  expect(output.total).toBe(6187.055444502041);
});

test('Deve fazer um pedido com 3 itens calculando o frete com preço mínimo', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 }
    ],
    from: '22060030',
    to: '88015600'
  };

  const output = await checkout.execute(input);

  expect(output.freight).toBe(217.05544450204079);
  expect(output.total).toBe(6307.055444502041);
});

test('Deve fazer um pedido com 3 itens e obter o pedido salvo', async function() {
  const idOrder = crypto.randomUUID();
  const input = {
    idOrder,
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 }
    ],
  };

  await checkout.execute(input);
  const output = await getOrder.execute(idOrder);
  expect(output.total).toBe(6090);
});

test('Deve fazer um pedido com 3 itens e gerar o código do pedido ', async function() {
  const orderRepository = repositoryFactory.createOrderRepository();
  await orderRepository.clear();
  await checkout.execute({
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 }
    ],
  });

  const idOrder2 = crypto.randomUUID();
  await checkout.execute({
    idOrder: idOrder2,
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 }
    ],
  });

  const output = await getOrder.execute(idOrder2);
  expect(output.code).toBe('202300000002');
});
