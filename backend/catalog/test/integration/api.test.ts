import axios from 'axios';
import crypto from 'crypto';

axios.defaults.validateStatus = function () {
  return true;
}

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

test('Deve retornar um produto', async function() {
  const response = await axios({
    url: 'http://localhost:3002/product/1',
  });
  const output = response.data;
  expect(output.id).toBe(1);
  expect(output.description).toBe('A');
  expect(output.price).toBe(1000);
  expect(output.width).toBe(100);
  expect(output.height).toBe(30);
  expect(output.length).toBe(10);
  expect(output.weight).toBe(3);
  expect(output.density).toBe(100);
  expect(output.volume).toBe(0.03);
});