import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';

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
}