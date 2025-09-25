import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { User } from './user.entity';
import { UsersService } from './users.service';

const pubSub = new PubSub();

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // TMP
  @Subscription(() => String, { name: 'postsAdded' })
  postsAdded() {
    return pubSub.asyncIterableIterator('postsAdded');
  }

  // TMP
  @Mutation(() => String)
  async addPost(@Args('message') message: string) {
    await pubSub.publish('postsAdded', { postsAdded: message });
    return message;
  }
}
