import axios from 'axios';

axios.defaults.validateStatus = function () {
  return true;
}

test('Não deve criar um pedido com CPF inválido', async function() {
  const input = {
    cpf: '378.299.138-88',
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.message).toBe('CPF inválido');
});

test('Não deve criar um pedido se algum produto não existir', async function() {
  const input = {
    cpf: '685.830.780-09',
    products: [
      { id: 999, quantity: 1 },
    ],
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.message).toBe('Produto não existente');
});


test('Deve criar um pedido com 3 produtos e calcular o valor total', async function () {
  const input = {
    cpf: '685.830.780-09',
    products: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
      { id: 3, quantity: 1 }
    ]
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.total).toBe(11030);
});

test('Deve criar um pedido com 3 produtos, associar um cupom válido e calcular o total (percentual sobre o total do pedido)', async function () {
  const input = {
    cpf: '685.830.780-09',
    couponCode: 'VALE20',
    products: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
      { id: 3, quantity: 1 }
    ]
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.total).toBe(8824);
});

test('Não deve aplicar cupom de desconto se o mesmo não existir', async function() {
  const input = {
    cpf: '685.830.780-09',
    couponCode: 'CUPOM_404',
    products: [
      { id: 1, quantity: 1 },
    ]
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.message).toBe('Cupom de desconto inexistente');
});

test('Não deve aplicar cupom de desconto expirado', async function() {
  const input = {
    cpf: '685.830.780-09',
    couponCode: 'VALE10',
    products: [
      { id: 1, quantity: 1 },
    ]
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.message).toBe('Cupom de desconto expirado');
});

test('Não deve fazer um pedido com quantidade negativa de item', async function() {
  const input = {
    cpf: '685.830.780-09',
    products: [
      { id: 1, quantity: -1 },
    ]
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(result.status).toBe(422);
  expect(output.message).toBe('Quantidade inválida');
});

test('Não deve ser possível fazer pedido com itens duplicados', async function() {
  const input = {
    cpf: '685.830.780-09',
    products: [
      { id: 1, quantity: 1 },
      { id: 1, quantity: 1 },
    ]
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(result.status).toBe(422);
  expect(output.message).toBe('Produto duplicado');
});

test('Deve fazer um pedido com 3 itens calculando o frete', async function() {
  const input = {
    cpf: '685.830.780-09',
    products: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
    ],
    from: '88015600',
    to: '22030060'
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.subtotal).toBe(6000);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test('Deve fazer um pedido com 3 itens calculando o frete com preço mínimo', async function() {
  const input = {
    cpf: '685.830.780-09',
    products: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 }
    ],
    from: '88015600',
    to: '22030060'
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});

