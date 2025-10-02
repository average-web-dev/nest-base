import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { Algorithm } from 'jsonwebtoken';
import { loadKeys } from '../config.util';

export const accessTokenConfig = registerAs(
  'ACCESS_TOKEN',
  async (): Promise<JwtModuleOptions & { publicKey?: string }> => {
    const privateKeyPath = process.env.JWT_ACCESS_PRIVATE_KEY_PATH;
    const publicKeyPath = process.env.JWT_ACCESS_PUBLIC_KEY_PATH;

    const config: Partial<JwtModuleOptions & { publicKey?: string }> = {
      global: false,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
        algorithm: (process.env.JWT_ACCESS_ALGORITHM as unknown as Algorithm) || 'HS256',
      },
    };

    if (privateKeyPath && publicKeyPath) {
      const { algorithm, privateKey, publicKey } = await loadKeys(privateKeyPath, publicKeyPath);

      config.privateKey = privateKey;
      config.publicKey = publicKey;
      config.signOptions!.algorithm = algorithm;
    } else {
      config.secret = process.env.JWT_ACCESS_SECRET || 'access_secret';
    }

    return config;
  },
);
