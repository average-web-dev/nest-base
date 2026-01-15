import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { EventsModule } from '@/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EventsModule],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
