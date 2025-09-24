import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(id: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(id);
    // TODO: bcrypt password comparison
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, id: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
