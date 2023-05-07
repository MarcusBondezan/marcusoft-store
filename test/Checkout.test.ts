import axios from 'axios';
import Checkout from '../src/Checkout';

axios.defaults.validateStatus = function () {
  return true;
}

test('Não deve criar um pedido com CPF inválido', async function() {
  const input = {
    cpf: '378.299.138-88',
    items: []
  };

  const checkout = new Checkout();

  expect(() => checkout.execute(input)).rejects.toThrow(new Error('CPF inválido'));
});

test('Não deve fazer um pedido com quantidade negativa de item', async function() {
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 1, quantity: -1 },
    ]
  };

  const checkout = new Checkout();

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

  const checkout = new Checkout();
  expect(() => checkout.execute(input)).rejects.toThrow(new Error('Produto duplicado'));
});

test('Não deve criar um pedido se algum produto não existir', async function() {
  const input = {
    cpf: '685.830.780-09',
    items: [
      { id: 999, quantity: 1 },
    ],
  };

  const checkout = new Checkout();
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

  const checkout = new Checkout();
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

  const checkout = new Checkout();
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

  const checkout = new Checkout();
  const output = await checkout.execute(input);

  expect(output.total).toBe(11030);
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

  const checkout = new Checkout();
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

  const checkout = new Checkout();
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

  const checkout = new Checkout();
  const output = await checkout.execute(input);

  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});