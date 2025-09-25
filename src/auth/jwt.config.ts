import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = registerAs(
  'JWT',
  () =>
    ({
      global: false,
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '30m' },
    }) as JwtModuleOptions & { secret: string },
);
