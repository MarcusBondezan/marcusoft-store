import Verify from "../../src/application/usecase/Verify";

test('Deve verificar o token', async function () {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25ueWJveUBnbWFpbC5jb20iLCJpYXQiOjE2NDYxMzk2MDAwMDAsImV4cGlyZXNJbiI6MTAwMDAwMH0._3HyYWyFMbcvyhuoQZVOveetk9qm2y01nXVKgRAwo2A';
  const verify = new Verify();
  const output = await verify.execute(token);
  expect(output.email).toBe('jhonnyboy@gmail.com');
});