import IHashProvider from '@modules/identity/domain/interfaces/providers/IHashProvider';
import { hash, compare } from 'bcryptjs';

class BcryptHashProvider implements IHashProvider {
  public async hash(password: string): Promise<string> {
    return hash(password, 8);
  }

  public async compare(
    plainTextPassword: string,
    hashedPasswordToCompare: string,
  ): Promise<boolean> {
    return compare(plainTextPassword, hashedPasswordToCompare);
  }
}

export default BcryptHashProvider;
