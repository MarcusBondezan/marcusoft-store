import User from '../../domain/entity/User';
import SignupUserRepository from '../repository/SignupUserRepository';

export default class Signup {
  constructor(readonly userRepository: SignupUserRepository){}

  async execute(input: Input): Promise<void> {
      const user = User.create(input.email, input.password, 'pbkdf2');
      await this.userRepository.save(user);
  }
}

type Input = {
  email: string,
  password: string
}