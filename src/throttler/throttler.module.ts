import { Module } from '@nestjs/common';
import { ThrottlerModule as ThrottlerBaseModule } from '@nestjs/throttler';

@Module({
  imports: [
     ThrottlerBaseModule.forRoot([
      {
        name: 'default',
        ttl: 100,
        limit: 100,
      },
    ]),
  ],
})
export class ThrottlerModule {}
