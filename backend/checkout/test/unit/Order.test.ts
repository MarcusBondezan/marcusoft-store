import crypto from 'crypto';
import Order from '../../src/domain/entity/Order';
import Product from '../../src/domain/entity/Product';
import Coupon from '../../src/domain/entity/Coupon';

test('Deve criar um pedido vazio', function() {
  const idOrder = crypto.randomUUID();
  const cpf = '685.830.780-09';
  const order = new Order(idOrder, cpf);
  expect(order.getTotal()).toBe(0);
});

test('Não deve criar pedidos com CPF inválido', function() {
  const idOrder = crypto.randomUUID();
  const cpf = '685.830.780-01';
  expect(() => new Order(idOrder, cpf)).toThrow(new Error('CPF Inválido'));
});

test('Deve criar um pedido com 3 itens', function() {
  const idOrder = crypto.randomUUID();
  const cpf = '685.830.780-09';
  const order = new Order(idOrder, cpf);

  order.addItem(new Product(1,'A',1000,100,30,10,3), 1);
  order.addItem(new Product(2,'B',5000,50,50,50,22), 1);
  order.addItem(new Product(3,'C',30,10,10,10,0.9), 3);

  expect(order.getTotal()).toBe(6090);
});

test('Não deve adicionar item duplicado', function() {
  const idOrder = crypto.randomUUID();
  const cpf = '685.830.780-09';
  const order = new Order(idOrder, cpf);

  order.addItem(new Product(1,'A',1000,100,30,10,3), 1);

  expect(() => order.addItem(new Product(1,'A',1000,100,30,10,3), 1)).toThrow(new Error('Item duplicado'));
});

test('Deve criar um pedido e gerar o código', function() {
  const idOrder = crypto.randomUUID();
  const cpf = '685.830.780-09';
  const order = new Order(idOrder, cpf, new Date('2023-10-01T10:00:00'), 1);

  expect(order.code).toBe('202300000001');
});

test('Deve criar um pedido com 3 itens', function() {
  const idOrder = crypto.randomUUID();
  const cpf = '685.830.780-09';
  const order = new Order(idOrder, cpf);

  order.addItem(new Product(1,'A',1000,100,30,10,3), 1);
  order.addItem(new Product(2,'B',5000,50,50,50,22), 1);
  order.addItem(new Product(3,'C',30,10,10,10,0.9), 3);

  order.addCoupon(new Coupon('VALE20', 20, new Date('2033-10-01T10:00:00')));

  expect(order.getTotal()).toBe(4872);
});