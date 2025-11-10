import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Vehicle } from '../../vehicles/schemas/vehicle.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Vehicle.name, required: true })
  vehicleId: Types.ObjectId;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);