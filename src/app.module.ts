import { Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';
import { ConfigModule } from '@/config/config.module';
import { GraphqlModule } from '@/graphql/graphql.module';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    ConfigModule,
    GraphqlModule,
    EventsModule,
  ],
})
export class AppModule {}
