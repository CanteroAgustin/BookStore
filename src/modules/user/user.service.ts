import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { status } from '../../shared/entity-status.enum';
import { RoleRepository } from '../role/role.repository';
import { ReadUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository
  ) {}
  async get(id: number): Promise<ReadUserDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const user: User = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }
  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    return users.map((user) => plainToClass(ReadUserDto, user));
  }

  async update(id: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const foundUser = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!foundUser) {
      throw new NotFoundException('User does not exist');
    }
    foundUser.username = user.username;
    const updatedUser = await this._userRepository.update(id, user);
    return plainToClass(ReadUserDto, updatedUser);
  }

  async delete(id: number): Promise<void> {
    const userExist = await this._userRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException();
    }

    await this._userRepository.update(id, { status: status.INACTIVE });
  }

  async setRoletoUser(userId: number, roleId: number): Promise<boolean> {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException();
    }
    const roleExist = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });
    if (!roleExist) {
      throw new NotFoundException();
    }
    userExist.roles.push(roleExist);

    await this._userRepository.save(userExist);
    return true;
  }
}
