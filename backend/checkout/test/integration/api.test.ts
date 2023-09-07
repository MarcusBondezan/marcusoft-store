import axios from 'axios';
import crypto from 'crypto';

axios.defaults.validateStatus = function () {
  return true;
}

test('Não deve criar pedido com cpf inválido', async function() {
  const input = {
    cpf: '406.302.170-27'
  };
  const response = await axios.post('http://localhost:3001/checkout', input);
  const output = response.data;
  expect(output.message).toBe('CPF Inválido');
});

test('Deve fazer um pedido com 3 itens', async function() {
  const input = {
    cpf: '407.302.170-27',
    idOrder: crypto.randomUUID(),
    items: [
      { id: 1, quantity: 1 },
      { id: 2, quantity: 1 },
      { id: 3, quantity: 3 },
    ]
  };
  const response = await axios.post('http://localhost:3001/checkout', input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test('Deve listar os produtos em json', async function() {
  const response = await axios({
    url: 'http://localhost:3002/products',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  const output = response.data;
  expect(output).toHaveLength(3);
  expect(output.at(0)?.id).toBe(1);
  expect(output.at(1)?.id).toBe(2);
  expect(output.at(2)?.id).toBe(3);
});

test('Deve listar os produtos em csv', async function() {
  const response = await axios({
    url: 'http://localhost:3002/products',
    headers: {
      'Content-Type': 'text/csv',
    }
  });
  const output = response.data;
  expect(output).toBe("1;A;1000\n2;B;5000\n3;C;30");
});