import { User } from '@/users/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { JwtPayload } from './jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(id: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const userWithPassword = await this.usersService.findOneWithPassword(id);
    if (userWithPassword && (await compare(pass, userWithPassword.password))) {
      const { password, ...user } = userWithPassword;
      return user;
    }
    return null;
  }

  login(user: User): string {
    const payload = this.buildPayload(user);
    return this.jwtService.sign(payload);
  }

  private buildPayload(user: User): JwtPayload {
    return { id: user.id };
  }
}
