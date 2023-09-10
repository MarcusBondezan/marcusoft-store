export default class User {
  constructor(readonly email: string, readonly password: string, readonly salt: string) {}
}