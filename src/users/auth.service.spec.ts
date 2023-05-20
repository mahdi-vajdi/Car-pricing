import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of atuh.service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'test');

    expect(user.password).not.toEqual('test');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws and error if user with an existing email', async () => {
    await service.signup('test@test.com', 'test');

    await expect(service.signup('test@test.com', 'test')).rejects.toThrow(
      new BadRequestException('Email already exists'),
    );
  });

  it('throws if signin is called with an invalid email', async () => {
    await expect(service.signin('test@test.com', 'test')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('throws if signin is called with an invalid password', async () => {
    await service.signup('test@test.com', 'test');

    await expect(service.signin('test@test.com', 'testtest')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('returns a user if signin is called with a valid password', async () => {
    await service.signup('test@test.com', 'test');

    const user = await service.signin('test@test.com', 'test');
    expect(user).toBeDefined();
  });
});
