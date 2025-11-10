import { Controller, Get, Req, Put, Param, Body, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import type { Request } from 'express';

@ApiTags('2. Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req) {
    return req.user;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const loggedInUserId = (req.user as any)._id;

    if (loggedInUserId.toString() !== id) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este usuário.',
      );
    }

    const updatedUser = await this.usersService.update(id, updateUserDto);

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado para atualização.');
    }

    const { password, ...result } = updatedUser.toObject();
    return result;
  }
}