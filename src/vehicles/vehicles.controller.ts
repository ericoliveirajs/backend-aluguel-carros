import { Controller, Post, Body, Get, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@ApiTags('3. Veículos')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    const updatedVehicle = await this.vehiclesService.update(
      id,
      updateVehicleDto,
    );
    if (!updatedVehicle) {
      throw new NotFoundException('Veículo não encontrado para atualização.');
    }
    return updatedVehicle;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedVehicle = await this.vehiclesService.remove(id);
    if (!deletedVehicle) {
      throw new NotFoundException('Veículo não encontrado para deleção.');
    }
    return deletedVehicle;
  }
}