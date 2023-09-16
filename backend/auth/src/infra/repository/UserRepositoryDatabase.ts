import DatabaseConnection from "../database/DabaseConnection";
import UserRepository from "../../application/repository/UserRepository";
import User from "../../domain/entity/User";

export default class UserRepositoryDatabase implements UserRepository {
  constructor (readonly connection: DatabaseConnection) {}

  async save(user: User): Promise<void> {
    await this.connection.query('insert into "user" (email, password, salt) values ($1, $2, $3)', [user.email.value, user.password, user.salt]);
  }

  async get(email: string): Promise<User> {
    const [userData] = await this.connection.query('select * from "user" us where us.email = $1', [email]);
    return User.restore(userData.email, userData.password, userData.salt);
  }

}