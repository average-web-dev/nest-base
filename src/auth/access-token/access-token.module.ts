import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { accessTokenConfig } from './access-token.config';
import { AccessTokenService } from './access-token.service';
import { AccessTokenStrategy } from './access-token.strategy';
import { AccessTokenAuthGuard } from './access-token-auth.guard';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';

@Module({
  imports: [
    RefreshTokenModule,
    JwtModule.registerAsync(accessTokenConfig.asProvider()),
    ConfigModule.forFeature(accessTokenConfig),
  ],
  providers: [
    AccessTokenService,
    AccessTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
  ],
  exports: [AccessTokenService],
})
export class AccessTokenModule {}
