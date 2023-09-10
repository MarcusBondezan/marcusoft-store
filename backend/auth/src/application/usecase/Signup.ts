import { pbkdf2Sync, randomBytes } from 'crypto';
import UserRepository from '../repository/UserRepository';
import User from '../../domain/entity/User';

export default class Signup {
  constructor(readonly userRepository: UserRepository){}

  async execute(input: Input): Promise<void> {
    if (this.isValid(input.email)) {
      const salt = randomBytes(20).toString('hex')
      const password = pbkdf2Sync(input.password, salt, 64, 100, 'sha512').toString('hex');
      const user = new User(input.email, password, salt);
      await this.userRepository.save(user);
    }
  }

  isValid (email: string): boolean {
    return true;
  }
}

type Input = {
  email: string,
  password: string
}