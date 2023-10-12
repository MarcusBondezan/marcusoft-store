import TokenGenerator from "../../src/domain/entity/TokenGenerator"
import User from "../../src/domain/entity/User";

test('Deve assinar um token', function () {
  const tokenGenerator = new TokenGenerator('secret');
  const user = User.create('jhonnyboy@gmail.com', 'abcd123', 'pbkdf2');
  const token = tokenGenerator.sign(user, new Date('2023-03-01T10:00:00'));
  expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25ueWJveUBnbWFpbC5jb20iLCJpYXQiOjE2Nzc2NzU2MDAwMDAsImV4cGlyZXNJbiI6MTAwMDAwMH0.pSKvuaT9HJuENLYelDWyd9bC96P_G8yT_dZKRPje8YI');
});

test('Deve verificar um token', function () {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25ueWJveUBnbWFpbC5jb20iLCJpYXQiOjE2Nzc2NzU2MDAwMDAsImV4cGlyZXNJbiI6MTAwMDAwMH0.pSKvuaT9HJuENLYelDWyd9bC96P_G8yT_dZKRPje8YI';
  const tokenGenerator = new TokenGenerator('secret');
  const output = tokenGenerator.verify(token);
  expect(output.email).toBe('jhonnyboy@gmail.com');
});