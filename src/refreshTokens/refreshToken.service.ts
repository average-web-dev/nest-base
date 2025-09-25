import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { JwtService as JwtServiceNative } from '@nestjs/jwt';
import { RefreshToken } from './refreshToken.entity';
import { RefreshTokenPayload } from './refreshToken-payload.dto';
import { refreshTokenConfig } from './refreshToken.config';
import { ConfigType } from '@nestjs/config';
import { User } from '@/users/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtServiceNative,
    @Inject(refreshTokenConfig.KEY)
    private readonly refreshTokenonfiguration: ConfigType<typeof refreshTokenConfig>,
  ) {}

  findOneByToken(tokenString: string): Promise<RefreshToken | null> {
    const { id } = this.jwtService.verify<RefreshTokenPayload>(tokenString);
    return this.findOneById(id);
  }

  findOneById(id: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findOneBy({ id });
  }

  async revoke(id: string): Promise<void> {
    const token = await this.refreshTokenRepository.findOneBy({ id });
    if (token) {
      token.revoked = true;
      await this.refreshTokenRepository.save(token);
    }
  }

  async create(user: User): Promise<RefreshToken>;
  async create(userId: string): Promise<RefreshToken>;
  async create(userOrId: User | string): Promise<RefreshToken> {
    const id = uuidv4();
    const payload: RefreshTokenPayload = {
      id,
      type: 'refresh',
    };

    const token = this.jwtService.sign(payload);
    const { iat, exp } = this.jwtService.verify<{ iat: number; exp: number }>(token);

    const model = this.refreshTokenRepository.create({
      id,
      token,
      user: typeof userOrId === 'object' ? userOrId : { id: userOrId },
      expiresAt: new Date(exp * 1000),
      createdAt: new Date(iat * 1000),
    });

    await this.refreshTokenRepository.save(model);

    return model;
  }
}
