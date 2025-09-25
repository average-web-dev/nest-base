import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { CurrentUser } from './curent-user.decorator';
import { UseGuards } from '@nestjs/common';
import { User } from '@/users/user.entity';
import { Public } from './public.decorator';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { AccessTokenService } from './access-token/access-token.service';
import { LoginResponse } from './loginResponse.dto';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Mutation(() => LoginResponse)
  @Public()
  @UseGuards(LocalAuthGuard)
  login(
    @CurrentUser() user: User,
    // args are required by passport-local strategy but not used
    @Args('username') _username: string,
    @Args('password') _password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.login(user);
  }

  @Public()
  @Mutation(() => String)
  async refreshToken(@Args('refreshToken') refreshTokenString: string): Promise<string> {
    const refreshToken = await this.refreshTokenService.findOneByToken(refreshTokenString);
    // TODO: proper error handling, expired tokens, revoked tokens, not found tokens
    if (!refreshToken) {
      throw new Error('Invalid refresh token');
    }

    return this.accessTokenService.generateToken(refreshToken);
  }

  @Query(() => User)
  me(@CurrentUser() user: User): User {
    return user;
  }

  @ResolveField('refreshTokens', () => [RefreshToken])
  refreshTokens(@Parent() user: User): Promise<RefreshToken[]> {
    return user.tokens;
  }
}
