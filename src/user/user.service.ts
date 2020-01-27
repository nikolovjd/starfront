import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from './models/user.entity';
import { RegisterRequestDto } from '../auth/request/register-request.dto';
import { UsernameAlreadyExistsError } from '../auth/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async createUser(data: RegisterRequestDto) {
    const newUser = this.userRepository.create(data);
    try {
      await this.userRepository.save(newUser);
    } catch (err) {
      if (err.message.includes('violates unique constraint')) {
        throw new UsernameAlreadyExistsError();
      }

      throw err;
    }
  }
}
