import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { accessTokenConfig } from './access-token.config';
import { AccessTokenPayload } from './access-token-payload.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(accessTokenConfig.KEY)
    private readonly accessTokenConfigService: ConfigType<typeof accessTokenConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accessTokenConfigService.publicKey ?? accessTokenConfigService.secret ?? '',
    });
  }

  // builds the req.user object
  async validate(payload: AccessTokenPayload) {
    const refreshToken = await this.refreshTokenService.findOneById(payload.rtid);
    if (!refreshToken || refreshToken.revoked) {
      return null;
    }
    return refreshToken.user;
  }
}
