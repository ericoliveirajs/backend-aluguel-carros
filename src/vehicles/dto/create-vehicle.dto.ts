import { IsString, IsNotEmpty, IsNumber, IsInt } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  motor: number;

  @IsInt()
  @IsNotEmpty()
  luggageCapacity: number;
}