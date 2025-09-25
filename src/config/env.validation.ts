import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches, Max, Min, validateSync } from 'class-validator';

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
  JWT_ACCESS_SECRET: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d+[smhd]$/, {
    message: 'JWT_EXPIRES_IN must be a valid time string (e.g. 30m, 1h, 7d)',
  })
  JWT_ACCESS_EXPIRES_IN: string;
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
    const errorStrings = errors
      .map((err) => Object.values(err.constraints || {}).join(', '))
      .join('; ');

    throw new Error(errorStrings);
  }
  return validatedConfig;
}
