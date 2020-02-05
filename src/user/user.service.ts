import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from './models/user.entity';
import { RegisterRequestDto } from '../auth/request/register-request.dto';
import { UsernameAlreadyExistsError } from '../auth/exceptions';
import { Empire } from '../empire/models/empire.entity';
import { Base } from '../base/models/base.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['empire'],
    });
  }

  async createUser(data: RegisterRequestDto) {
    const user = this.userRepository.create(data);
    try {
      return this.connection.transaction(async t => {
        await t.save(user);
        const empire = t.getRepository(Empire).create({ user });
        await t.save(empire);
        const base = t.getRepository(Base).create({ empire });
        await t.save(base);
        return user;
      });
    } catch (err) {
      if (err.message.includes('violates unique constraint')) {
        throw new UsernameAlreadyExistsError();
      }

      throw err;
    }
  }
}
