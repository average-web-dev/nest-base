import { User } from '@/users/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { JwtPayload } from './jwt-payload.dto';
import { RefreshTokenService } from '@/refreshTokens/refreshToken.service';
import { RefreshToken } from '@/refreshTokens/refreshToken.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
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

  generateAccessToken(refreshToken: RefreshToken): string {
    const payload: JwtPayload = {
      refreshTokenId: refreshToken.id,
      type: 'access',
    };

    return this.jwtService.sign(payload);
  }

  async login(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.refreshTokenService.create(user);
    return {
      refreshToken: refreshToken.token,
      accessToken: this.generateAccessToken(refreshToken),
    };
  }
}
