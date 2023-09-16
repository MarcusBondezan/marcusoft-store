import Email from "./Email";
import Password from './Password';

// Entity - Aggregate Root
export default class User {
  private constructor(public email: Email, public password: Password) {}

  // static factory method
  static create (email: string, password: string): User {
    return new User(new Email(email), Password.create(password));
  }

  // static factory method
  static restore (email: string, password: string, salt: string): User {
    return new User(new Email(email), Password.restore(password, salt));
  }

  updatePassword(password: string): void {
    this.password = Password.create(password);
  }

  isValidPassword(password: string): boolean {
    return this.password.validate(password);
  }
}