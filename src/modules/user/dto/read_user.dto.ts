import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNumber } from 'class-validator';
import { ReadRoleDto } from '../../../modules/role/dtos';
import { ReadUserDetailsDto } from './read-user-details.dto';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly id: number;
  @Expose()
  @IsEmail()
  readonly email: string;
  @Expose()
  @IsEmail()
  readonly username: string;
  @Expose()
  @Type(() => ReadUserDetailsDto)
  readonly details: ReadUserDetailsDto;
  @Expose()
  @Type(() => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
