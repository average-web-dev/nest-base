import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../refresh-token/refresh-token.entity';
import { AccessTokenPayload } from './access-token-payload.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessTokenService {
  constructor(private readonly jwtService: JwtService) {}

  public generateToken(refreshToken: RefreshToken): Promise<string> {
    const payload: AccessTokenPayload = {
      rtid: refreshToken.id,
      type: 'access',
    };

    return this.jwtService.signAsync(payload);
  }
}
