import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUsersService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn().mockResolvedValue('mocked_jwt_token'),
};

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password_mock'),
  compare: jest.fn().mockResolvedValue(true),
  genSalt: jest.fn().mockResolvedValue('salt_mock'),
}));

const MOCK_USER_ID = 'user_id_123';
const MOCK_USER_ROLES = ['user'];
const MOCK_USER_DOCUMENT = {
  _id: MOCK_USER_ID,
  email: 'test@email.com',
  password: 'hashed_password_mock',
  roles: MOCK_USER_ROLES,
  toObject: () => ({
    _id: MOCK_USER_ID,
    email: 'test@email.com',
    roles: MOCK_USER_ROLES,
    password: 'hashed_password_mock',
  }),
};
const MOCK_CREATE_DTO = { name: 'Test User', email: 'test@email.com', password: 'plainpassword' };
const MOCK_LOGIN_DTO = { email: 'test@email.com', password: 'plainpassword' };


describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('deve criar um novo usuário e retornar os dados (sem senha)', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(MOCK_USER_DOCUMENT);
      
      const result = await service.register(MOCK_CREATE_DTO);

      expect(bcrypt.hash).toHaveBeenCalledWith(MOCK_CREATE_DTO.password, 'salt_mock');
      expect(usersService.create).toHaveBeenCalled();
      expect(result).toHaveProperty('email', MOCK_CREATE_DTO.email);
      expect(result).not.toHaveProperty('password');
    });

    it('deve falhar com ConflictException se o usuário já existir', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(MOCK_USER_DOCUMENT);
      
      await expect(service.register(MOCK_CREATE_DTO)).rejects.toThrow(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('deve retornar um access_token em caso de sucesso', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(MOCK_USER_DOCUMENT);
      
      const result = await service.login(MOCK_LOGIN_DTO);

      expect(bcrypt.compare).toHaveBeenCalledWith(MOCK_LOGIN_DTO.password, MOCK_USER_DOCUMENT.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: MOCK_USER_ID,
        email: MOCK_USER_DOCUMENT.email,
        roles: MOCK_USER_ROLES,
      });
      expect(result).toEqual({ access_token: 'mocked_jwt_token' });
    });

    it('deve falhar com UnauthorizedException se o usuário não for encontrado', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login(MOCK_LOGIN_DTO)).rejects.toThrow(UnauthorizedException);
    });
    
    it('deve falhar com UnauthorizedException se a senha não bater', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(MOCK_USER_DOCUMENT);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(MOCK_LOGIN_DTO)).rejects.toThrow(UnauthorizedException);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});