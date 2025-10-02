import type { Algorithm } from 'jsonwebtoken';

import { createPrivateKey, KeyType } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const defaultAlgorithms: { [key in KeyType]?: Algorithm } = {
  rsa: 'RS256',
  'rsa-pss': 'PS256',
  ec: 'ES256',
};

export interface LoadKeyOptions {
  privateKeyPath: string;
  publicKeyPath: string;
}

export async function loadKeys(privateKeyPath: string, publicKeyPath: string) {
  const [privateKeyString, publicKeyString] = await Promise.all([
    readFile(privateKeyPath, 'utf8'),
    readFile(publicKeyPath, 'utf8'),
  ]);

  const privateKey = createPrivateKey(privateKeyString);
  const algorithm = defaultAlgorithms[privateKey.asymmetricKeyType as KeyType];

  return {
    algorithm,
    privateKey,
    publicKey: publicKeyString,
  };
}
