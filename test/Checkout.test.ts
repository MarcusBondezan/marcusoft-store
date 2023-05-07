import axios from 'axios';
import sinon from 'sinon';
import Checkout from '../src/Checkout';
import ProductRepository from '../src/ProductRepository';
import CouponRepository from '../src/CouponRepository';
import ProductRepositoryDatabase from '../src/ProductRepositoryDatabase';
import EmailGatewayConsole from '../src/EmailGatewayConsole';

axios.defaults.validateStatus = function () {
  return true;
}

let checkout: Checkout;

beforeEach(() => {

  const products: any = {
    1: { 
      id: 1, 
      description: 'A', 
      price: 1000,
      width: 100,
      height: 30,
      length: 10,
      weight: 3
    },
    2: { 
      id: 2, 
      description: 'B', 
      price: 5000,
      width: 50,
      height: 50,
      length: 50,
      weight: 22
    },
    3: { 
      id: 3, 
      description: 'C', 
      price: 30,
      width: 10,
      height: 10,
      length: 10,
      weight: 0.9
    },
  };

  const productRepository: ProductRepository = {
    async get(idProduct: number): Promise<any> {
      const product = products[idProduct];
      //console.log({ product })
      return product;
    }
  };

  const coupons: any = {
    "VALE20": {
      code: 'VALE20', 
      percentage: 20,
      expire_date: new Date('2023-10-01T10:00:00')
    },
    "VALE10": {
      code: 'VALE10', 
      percentage: 10,
      expire_date: new Date('2022-10-01T10:00:00')
    }
  }

  const couponRepository: CouponRepository = {
    async get(code: string): Promise<any> {
      const coupon = coupons[code];
      return coupon;
    }
  };

  checkout = new Checkout(productRepository, couponRepository);
});

test('Não deve criar um pedido com CPF inválido', async function() {
  const input = {
    cpf: '378.299.138-88',
    items: []
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('CPF inválido'));
});

test('Não deve fazer um pedido com quantidade negativa de item', async function() {
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: -1 },
    ]
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Quantidade inválida'));
});

test('Não deve ser possível fazer pedido com itens duplicados', async function() {
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 1, quantity: 1 },
    ]
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Produto duplicado'));
});

test('Não deve criar um pedido se algum produto não existir', async function() {
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 999, quantity: 1 },
    ],
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Produto não existente'));
});

test('Não deve aplicar cupom de desconto se o mesmo não existir', async function() {
  const input = {
    cpf: '685.830.780-09',
    coupon: 'CUPOM_404',
    items: [
      { id: 1, quantity: 1 },
    ]
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Cupom de desconto inexistente'));
});

test('Não deve aplicar cupom de desconto expirado', async function() {
  const input = {
    cpf: '685.830.780-09',
    coupon: 'VALE10',
    items: [
      { id: 1, quantity: 1 },
    ]
  };

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Cupom de desconto expirado'));
});

test('Deve criar um pedido com 3 produtos e calcular o valor total', async function () {
  const input = {
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
  const productRepositoryStub = sinon.stub(ProductRepositoryDatabase.prototype, 'get').resolves({
    id: 1, description: 'A', price: 1000, 
  });
  checkout = new Checkout();
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
    ]
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(1000);
  productRepositoryStub.restore();
});

test('Deve verificar se o email foi enviado usando um spy', async function () {
  const emailGatewaySpy = sinon.spy(EmailGatewayConsole.prototype, "send");
  const productRepositoryStub = sinon.stub(ProductRepositoryDatabase.prototype, 'get').resolves({
    id: 1, description: 'A', price: 1000, 
  });
  checkout = new Checkout();
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
    ],
    email: 'john.doe@gmail.com'
  };

  const output = await checkout.execute(input);
  expect(output.total).toBe(1000);
  expect(emailGatewaySpy.calledOnce).toBeTruthy();
  productRepositoryStub.restore();
  emailGatewaySpy.restore();
});

test('Deve verificar se o email foi enviado usando um mock', async function () {
  const productRepositoryMock = sinon.mock(ProductRepositoryDatabase.prototype);
  productRepositoryMock.expects("get").once().resolves({
    id: 1, description: 'A', price: 1000, 
  });

  checkout = new Checkout();
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
    ],
    email: 'john.doe@gmail.com'
  };

  const output = await checkout.execute(input);
  productRepositoryMock.verify();
});

test('Deve criar um pedido com 3 produtos, associar um cupom válido e calcular o total (percentual sobre o total do pedido)', async function () {
  const input = {
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

test('Deve fazer um pedido com 3 itens calculando o frete', async function() {
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
    ],
    from: '88015600',
    to: '22030060'
  };

  const output = await checkout.execute(input);

  expect(output.subtotal).toBe(6000);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test('Deve fazer um pedido com 3 itens calculando o frete com preço mínimo', async function() {
  const input = {
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

  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});