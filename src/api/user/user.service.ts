import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { EnvInterface } from 'src/core/interface/env.interface';

@Injectable()
export class UserService {
  constructor(private readonly configServiceModule: ConfigService<EnvInterface>) {}

  create(createUserDto: CreateUserDto) {
    return {
      createUserDto
    };
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return {
      id,
      updateUserDto
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
