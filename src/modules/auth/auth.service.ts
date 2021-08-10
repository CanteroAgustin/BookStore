import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService
  ) {}

  async signup(signUpDto: SignupDto): Promise<void> {
    const { username, email } = signUpDto;
    const userExist = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExist) {
      throw new ConflictException('username or email already exists');
    }

    return this._authRepository.signup(signUpDto);
  }

  async signin(signInDto: SigninDto): Promise<{ token: string }> {
    const { username, password } = signInDto;
    const user: User = await this._authRepository.findOne({
      where: [{ username }],
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = await this._jwtService.sign(payload);

    return { token };
  }
}
