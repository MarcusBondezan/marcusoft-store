import axios from 'axios';

axios.defaults.validateStatus = function () {
  return true;
}

test('Deve verificar um token', async function() {
  const input = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impob25ueWJveUBnbWFpbC5jb20iLCJpYXQiOjE2NDYxMzk2MDAwMDAsImV4cGlyZXNJbiI6MTAwMDAwMH0._3HyYWyFMbcvyhuoQZVOveetk9qm2y01nXVKgRAwo2A'
  };
  const response = await axios.post('http://localhost:3004/verify', input);
  const output = response.data;
  expect(output.email).toBe('jhonnyboy@gmail.com');
});