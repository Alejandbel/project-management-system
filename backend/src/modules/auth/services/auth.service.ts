import { compare, hash } from 'bcrypt';
import { inject, injectable } from 'inversify';

import { ServiceError } from '@modules/core';
import { UsersService } from '@modules/users';

import { SALT_ROUNDS } from '../contants';
import { SignInUser, SignUpUser } from '../types';

import { JwtService } from './jwt.service';

@injectable()
export class AuthService {
  @inject(UsersService) private readonly usersService: UsersService;
  @inject(JwtService) private readonly jwtService: JwtService;

  async signIn({ email, password }: SignInUser): Promise<string> {
    const user = await this.usersService.findOneOrFail({ email });

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new ServiceError('Password incorrect');
    }

    return this.generateTokenForUser(user.id);
  }

  async signUp(user: SignUpUser): Promise<string> {
    const dbUser = await this.usersService.findOne({ email: user.email });
    if (dbUser) {
      throw new ServiceError('User already exists');
    }

    const hashedPassword = await hash(user.password, SALT_ROUNDS);
    const userId = await this.usersService.create({ ...user, password: hashedPassword });

    return this.generateTokenForUser(userId);
  }

  private async generateTokenForUser(userId: number): Promise<string> {
    const userWithRole = await this.usersService.findOneWithRoleOrFail({ id: userId });
    return this.jwtService.generateAccessToken(userWithRole);
  }
}
