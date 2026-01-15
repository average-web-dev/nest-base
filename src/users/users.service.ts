import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { TypedEventEmitter } from '@/events/typed-event-emitter.service';
import { USER_EVENTS } from './user.events';
import { OnTypedEvent } from '@/events/on-typed-event.decorator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User | null> {
    console.log('emit')
    this.eventEmitter.emit(USER_EVENTS.FOUND, { id });
    return this.usersRepository.findOneBy({ id });
  }

  findOneWithPassword(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder()
      .setFindOptions({
        take: 1,
      })
      .whereInIds(id)
      .addSelect('User.password')
      .getOne();
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  @OnTypedEvent(USER_EVENTS.FOUND)
  public name(payload: { id: string }) {
    console.log('handle', payload)
  }
}
