import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsNumber()
  @Min(0)
  @Max(65535)
  APP_PORT: number;

  @IsString()
  @IsOptional()
  DB_HOST: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  JWT_SECRET: string;
}

/**APP_PORT=3000

DB_HOST=localhost
DB_PASSWORD=postgres
DB_USER=postgres
DB_NAME=auth

JWT_SECRET=example
 */

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
