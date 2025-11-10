import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from './schemas/reservation.schema';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { VehicleStatus } from '../vehicles/schemas/vehicle.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private vehiclesService: VehiclesService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    userId: string,
  ) {
    const { vehicleId } = createReservationDto;

    const existingReservationForUser = await this.reservationModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();

    if (existingReservationForUser) {
      throw new ConflictException(
        'Você já possui uma reserva ativa. Não é possível reservar mais de um veículo.',
      );
    }

    const vehicle = await this.vehiclesService.findById(vehicleId);

    if (!vehicle) {
      throw new NotFoundException('O veículo solicitado não foi encontrado.');
    }

    if (vehicle.status === VehicleStatus.RESERVADO) {
      throw new ConflictException('Este veículo já está reservado.');
    }

    await this.vehiclesService.updateStatus(
      vehicleId,
      VehicleStatus.RESERVADO,
    );

    const createdReservation = new this.reservationModel({
      userId: new Types.ObjectId(userId),
      vehicleId: new Types.ObjectId(vehicleId),
    });

    return createdReservation.save();
  }
}