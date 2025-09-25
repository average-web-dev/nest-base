import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { refreshTokenConfig } from './refresh-token.config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    ConfigModule.forFeature(refreshTokenConfig),
    JwtModule.registerAsync(refreshTokenConfig.asProvider()),
  ],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
