import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/models/user.entity';
import { RegisterRequestDto } from './request/register-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await this.verifyPassword(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { empireId: user.empire.id, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: RegisterRequestDto) {
    // Hash password
    data.password = await this.hashPassword(data.password);
    return this.usersService.createUser(data);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
