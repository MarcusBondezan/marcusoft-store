import axios from 'axios';
import sinon from 'sinon';
import crypto from 'crypto';
import Checkout from '../src/Checkout';
import ProductRepository from '../src/ProductRepository';
import CouponRepository from '../src/CouponRepository';
import ProductRepositoryDatabase from '../src/ProductRepositoryDatabase';
import GetOrder from '../src/GetOrder';
import OrderRepositoryDatabase from '../src/OrderRepositoryDatabase';
import Product from '../src/Product';
import Coupon from '../src/Coupon';

axios.defaults.validateStatus = function () {
  return true;
}

let checkout: Checkout;
let getOrder: GetOrder;
const orderRepository = new OrderRepositoryDatabase();

beforeEach(() => {

  const products: any = {
    1: new Product(1,'A',1000,100,30,10,3),
    2: new Product(2,'B',5000,50,50,50,22), 
    3: new Product(3,'C',30,10,10,10,0.9),
  };

  const productRepository: ProductRepository = {
    async get(idProduct: number): Promise<any> {
      const product = products[idProduct];
      return product;
    }
  };

  const coupons: any = {
    "VALE20": new Coupon('VALE20', 20, new Date('2023-10-01T10:00:00')),
    "VALE10": new Coupon('VALE10', 10, new Date('2022-10-01T10:00:00')),
  }

  const couponRepository: CouponRepository = {
    async get(code: string): Promise<any> {
      const coupon = coupons[code];
      return coupon;
    }
  };

  checkout = new Checkout(productRepository, couponRepository, orderRepository);
  getOrder = new GetOrder(orderRepository);
});

test('Não deve criar um pedido com CPF inválido', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '378.299.138-88',
    items: []
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('CPF Inválido'));
});

test('Não deve fazer um pedido com quantidade negativa de item', async function() {
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: -1 },
    ]
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Quantidade inválida'));
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

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Item duplicado'));
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
  const productRepositoryStub = sinon.stub(ProductRepositoryDatabase.prototype, 'get')
  .resolves(new Product(1, 'A', 1000, 1, 1, 1, 1));
  checkout = new Checkout();
  const input = {
    idOrder: crypto.randomUUID(),
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
    ]
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(1000);
  productRepositoryStub.restore();
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
    from: '88015600',
    to: '22030060'
  };

  const output = await checkout.execute(input);

  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
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
    from: '88015600',
    to: '22030060'
  };

  const output = await checkout.execute(input);

  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
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

test('Deve fazer um pedido com 3 e gerar o código do pedido ', async function() {
  const now = new Date('2023-01-01T10:00:00');
  const dateStub = sinon.useFakeTimers(now.getTime());
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
  dateStub.restore();
});