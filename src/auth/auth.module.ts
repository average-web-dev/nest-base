import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { AccessTokenModule } from './access-token/access-token.module';

@Module({
  imports: [UsersModule, AccessTokenModule, RefreshTokenModule, PassportModule],
  providers: [AuthService, LocalStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
