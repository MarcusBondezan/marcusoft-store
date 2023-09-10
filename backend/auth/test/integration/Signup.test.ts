import Login from "../../src/application/usecase/Login";
import Signup from "../../src/application/usecase/Signup";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import UserRepositoryDatabase from "../../src/infra/repository/UserRepositoryDatabase";

test('Deve fazer um signup', async function () {
  const connection = new PgPromiseAdapter();
  await connection.connect();
  const userRepository = new UserRepositoryDatabase(connection);
  const signup = new Signup(userRepository);

  await signup.execute({
    email: 'jhonnyboy@gmail.com',
    password: 'el123',
  });
  
  const login = new Login(userRepository);
  const output = await login.execute({
    email: 'jhonnyboy@gmail.com',
    password: 'el123',
    date: new Date('2022-03-01T10:00:00')
  });
  expect(output.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25ueWJveUBnbWFpbC5jb20iLCJpYXQiOjE2NDYxMzk2MDAwMDAsImV4cGlyZXNJbiI6MTAwMDAwMH0._3HyYWyFMbcvyhuoQZVOveetk9qm2y01nXVKgRAwo2A');

  await connection.close();
});