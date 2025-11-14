import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

export enum VehicleStatus {
  DISPONIVEL = 'disponivel',
  RESERVADO = 'reservado',
}

@Schema({ timestamps: true })
export class Vehicle {

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  motor: number;

  @Prop({ required: true })
  luggageCapacity: number;

  @Prop({ required: true, enum: VehicleStatus, default: VehicleStatus.DISPONIVEL })
  status: VehicleStatus;

  @Prop({ required: true })
  imageUrl: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);