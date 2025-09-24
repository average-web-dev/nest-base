import { registerAs } from '@nestjs/config';

export default registerAs('JWT', () => ({
  global: true,
  secret: process.env.JWT_SECRET || 'example',
  signOptions: { expiresIn: '60s' },
}));
