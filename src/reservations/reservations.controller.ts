import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import type { Request } from 'express';

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
}