import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { VehicleStatus } from '../vehicles/schemas/vehicle.schema';
import { VehiclesService } from '../vehicles/vehicles.service';

const MOCK_USER_ID = new Types.ObjectId().toString();
const MOCK_VEHICLE_ID = new Types.ObjectId().toString();
const MOCK_VEHICLE_DISPONIVEL = {
  _id: MOCK_VEHICLE_ID,
  status: VehicleStatus.DISPONIVEL,
  toObject: () => ({ status: VehicleStatus.DISPONIVEL }),
};

const mockReservationModel = jest.fn().mockImplementation((dto) => {
  return {
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, toObject: () => dto }),
  };
});

(mockReservationModel as any).findOne = jest.fn().mockImplementation(() => ({
  exec: jest.fn().mockResolvedValue(null),
}));

(mockReservationModel as any).deleteOne = jest
  .fn()
  .mockResolvedValue({ deletedCount: 1 });

const mockVehiclesService = {
  findById: jest.fn(),
  updateStatus: jest.fn(),
};

describe('ReservationsService (Testes de Regras de Negócio)', () => {
  let service: ReservationsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken('Reservation'),
          useValue: mockReservationModel,
        },
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma reserva e atualizar o status do veículo', async () => {
      mockVehiclesService.findById.mockResolvedValue(MOCK_VEHICLE_DISPONIVEL);
      (mockReservationModel as any).findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      const result = await service.create(
        { vehicleId: MOCK_VEHICLE_ID },
        MOCK_USER_ID,
      );

      expect(mockVehiclesService.updateStatus).toHaveBeenCalledWith(
        MOCK_VEHICLE_ID,
        VehicleStatus.RESERVADO,
      );
      expect(mockReservationModel).toHaveBeenCalledTimes(1);

      const lastCallArgs = (mockReservationModel as any).mock.calls[0]?.[0];
      expect({
        userId: lastCallArgs.userId.toString(),
        vehicleId: lastCallArgs.vehicleId.toString(),
      }).toEqual({
        userId: MOCK_USER_ID.toString(),
        vehicleId: MOCK_VEHICLE_ID.toString(),
      });
      const possibleInstance = (mockReservationModel as any).mock.results[0]?.value;
      if (possibleInstance?.save) {
        expect(possibleInstance.save).toHaveBeenCalled();
      }

      expect(result).toBeDefined();
    });

    it('deve falhar se o usuário já possuir uma reserva ativa', async () => {
      (mockReservationModel as any).findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({ userId: MOCK_USER_ID }),
      }));

      await expect(
        service.create({ vehicleId: MOCK_VEHICLE_ID }, MOCK_USER_ID),
      ).rejects.toThrow(ConflictException);
      expect(mockVehiclesService.updateStatus).not.toHaveBeenCalled();
    });

    it('deve falhar se o veículo já estiver reservado', async () => {
      (mockReservationModel as any).findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));
      mockVehiclesService.findById.mockResolvedValue({
        ...MOCK_VEHICLE_DISPONIVEL,
        status: VehicleStatus.RESERVADO,
      });

      await expect(
        service.create({ vehicleId: MOCK_VEHICLE_ID }, MOCK_USER_ID),
      ).rejects.toThrow(ConflictException);
      expect(mockVehiclesService.updateStatus).not.toHaveBeenCalled();
    });

    it('deve falhar se o veículo não for encontrado', async () => {
      mockVehiclesService.findById.mockResolvedValue(null);

      await expect(
        service.create({ vehicleId: MOCK_VEHICLE_ID }, MOCK_USER_ID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancelForUser', () => {
    it('deve cancelar a reserva e liberar o status do veículo', async () => {
      (mockReservationModel as any).findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          _id: 'mockReservationId',
          vehicleId: { toString: () => MOCK_VEHICLE_ID },
        }),
      }));

      const result = await service.cancelForUser(MOCK_USER_ID);

      expect(mockVehiclesService.updateStatus).toHaveBeenCalledWith(
        MOCK_VEHICLE_ID,
        VehicleStatus.DISPONIVEL,
      );
      expect((mockReservationModel as any).deleteOne).toHaveBeenCalledWith({
        _id: 'mockReservationId',
      });
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('deve falhar se o usuário não possuir reserva', async () => {
      (mockReservationModel as any).findOne.mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(null),
      }));

      await expect(service.cancelForUser(MOCK_USER_ID)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockVehiclesService.updateStatus).not.toHaveBeenCalled();
    });
  });
});
