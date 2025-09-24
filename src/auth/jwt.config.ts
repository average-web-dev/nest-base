import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('JWT', () => ({
  global: true,
  secret: process.env.JWT_SECRET || 'example',
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '30m' },
}));
