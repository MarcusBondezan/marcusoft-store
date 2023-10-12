import User from "../../domain/entity/User";
import SignupUserRepository from "./SignupUserRepository";

export default interface UserRepository extends SignupUserRepository {
  save (user: User): Promise<void>;
  get (email: string): Promise<User>;
  delete (email: string): Promise<void>;
}