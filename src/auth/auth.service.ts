import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new ConflictException('Este email já está em uso');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const userToCreate = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUser = await this.usersService.create(userToCreate);
    const { password, ...result } = createdUser.toObject();
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user._id, email: user.email, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}