import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './curent-user.decorator';
import { UseGuards } from '@nestjs/common';
import { User } from '@/users/user.entity';
import { GqlLocalAuthGuard } from './gql-local-auth.guard';
import { Public } from './public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  @Public()
  @UseGuards(GqlLocalAuthGuard)
  login(
    @CurrentUser() user: User,
    // args are required by passport-local strategy but not used
    @Args('username') _username: string,
    @Args('password') _password: string,
  ): string {
    return this.authService.login(user);
  }

  @Query(() => User)
  me(@CurrentUser() user: User): User {
    return user;
  }
}
