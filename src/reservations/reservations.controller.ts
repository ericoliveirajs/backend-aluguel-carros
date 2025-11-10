import { Controller, Post, Body, Req, Get, Delete } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('4. Reservas')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) { }

  @Post()
  create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any)._id;

    return this.reservationsService.create(createReservationDto, userId);
  }
  @Get('me')
  findMyReservation(@Req() req: Request) {
    const userId = (req.user as any)._id;

    return this.reservationsService.findForUser(userId);
  }
  @Delete('me')
  cancelMyReservation(@Req() req: Request) {
    const userId = (req.user as any) ._id;
    return this.reservationsService.cancelForUser(userId);
  }
}