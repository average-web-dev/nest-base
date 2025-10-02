import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import type { Algorithm } from 'jsonwebtoken';
import { loadKeys } from '../config.util';

export const refreshTokenConfig = registerAs(
  'REFRESH_TOKEN',
  async (): Promise<JwtModuleOptions> => {
    const privateKeyPath = process.env.JWT_REFRESH_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_REFRESH_PUBLIC_KEY_PATH;

    const config: Partial<JwtModuleOptions> = {
      global: false,
      signOptions: {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        algorithm: (process.env.JWT_REFRESH_ALGORITHM as unknown as Algorithm) || 'HS256',
      },
    };

    if (privateKeyPath && publicKeyPath) {
      const { algorithm, privateKey, publicKey } = await loadKeys(privateKeyPath, publicKeyPath);

      config.privateKey = privateKey;
      config.publicKey = publicKey;
      config.signOptions!.algorithm = algorithm;
    } else {
      config.secret = process.env.JWT_REFRESH_SECRET || 'refresh_secret';
    }

    return config;
  },
);
