import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ReservationsService } from '../reservations/reservations.service';

const mockUserModel = {};
const mockReservationsService = {};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
        {
          provide: ReservationsService,
          useValue: mockReservationsService, 
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });
});