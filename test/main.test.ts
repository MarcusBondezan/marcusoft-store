import axios from 'axios';

test('Não deve criar um pedido com CPF inválido', async function() {
  const input = {
    cpf: '378.299.138-88',
  };

  const result = await axios.post('http://localhost:3001/checkout', input);
  const output = result.data;

  expect(output.message).toBe('CPF inválido');
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

test('Deve criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido)', async function () {
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

