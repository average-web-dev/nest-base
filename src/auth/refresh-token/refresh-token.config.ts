import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const refreshTokenConfig = registerAs(
  'REFRESH_TOKEN',
  () =>
    ({
      global: false,
      secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      signOptions: { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
    }) as JwtModuleOptions,
);
