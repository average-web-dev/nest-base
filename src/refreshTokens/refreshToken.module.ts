import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refreshToken.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refreshToken.entity';
import { refreshTokenConfig } from './refreshToken.config';
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
