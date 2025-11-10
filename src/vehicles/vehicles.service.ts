import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle, VehicleDocument, VehicleStatus } from './schemas/vehicle.schema';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleDocument> {
    const createdVehicle = new this.vehicleModel(createVehicleDto);
    return createdVehicle.save();
  }

  async findAll(): Promise<VehicleDocument[]> {
    return this.vehicleModel.find().exec();
  }

  async findById(id: string): Promise<VehicleDocument | null> {
    return this.vehicleModel.findById(id).exec();
  }

  async updateStatus(
    id: string,
    status: string,
  ): Promise<VehicleDocument | null> {
    return this.vehicleModel
      .findByIdAndUpdate(id, { status: status }, { new: true })
      .exec();
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleDocument | null> {
    return this.vehicleModel
      .findByIdAndUpdate(id, updateVehicleDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    const vehicle = await this.findById(id);

    if (vehicle?.status === VehicleStatus.RESERVADO) {
      throw new ConflictException(
        'Não é possível deletar um veículo que está reservado.',
      );
    }

    return this.vehicleModel.findByIdAndDelete(id).exec();
  }
}