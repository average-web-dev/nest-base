import { User } from '@/users/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { AccessTokenService } from './access-token/access-token.service';
import { LoginResponse } from './loginResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(id: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const userWithPassword = await this.usersService.findOneWithPassword(id);
    if (userWithPassword && (await compare(pass, userWithPassword.password))) {
      const { password: _, ...user } = userWithPassword;
      return user;
    }
    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    const refreshToken = await this.refreshTokenService.create(user.id);

    return {
      refreshToken: refreshToken.token,
      accessToken: await this.accessTokenService.generateToken(refreshToken),
    };
  }
}
