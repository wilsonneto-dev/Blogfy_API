import { inject, injectable } from 'tsyringe';

import ICreateUserService, {
  ICreateUserServiceRequest,
  ICreateUserServiceResponse,
} from '@modules/identity/domain/interfaces/services/ICreateUserService';

import IUsersRepository from '@modules/identity/domain/interfaces/repositories/IUsersRepository';
import IHashProvider from '@modules/identity/domain/interfaces/providers/IHashProvider';
import EmailAlreadyExistsException from '../errors/EmailAlreadyExistsException';

@injectable()
class CreateUserService implements ICreateUserService {
  constructor(
    @inject('UsersRepository')
    private _usersRepository: IUsersRepository,

    @inject('HashProvider')
    private _passwordHashProvider: IHashProvider,
  ) {}

  public async execute({
    name,
    email,
    password,
  }: ICreateUserServiceRequest): Promise<ICreateUserServiceResponse> {
    const userByEmail = await this._usersRepository.findUserByEmail(email);
    if (userByEmail) {
      throw new EmailAlreadyExistsException('E-mail already exists');
    }

    const hashedPassword = await this._passwordHashProvider.hash(password);
    const user = await this._usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    } as any;
  }
}

export default CreateUserService;
