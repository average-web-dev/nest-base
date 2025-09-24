import { Module } from '@nestjs/common';
import { ConfigModule as ConfigRootModule } from '@nestjs/config';
import { validate } from './env.validation';

@Module({
  imports: [
    ConfigRootModule.forRoot({
      expandVariables: true,
      validate,
      isGlobal: false,
    }),
  ],
})
export class ConfigModule {}
