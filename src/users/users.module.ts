import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ReservationsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
