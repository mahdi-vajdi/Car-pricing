import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'test',
        } as User);
      },
      findByEmail: (email: string) => {
        return Promise.resolve([
          {
            id: 1,
            email,
            password: 'test',
          },
        ] as User[]);
      },
    };

    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllusers return a list of users with given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser return a user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an exception if no user is found', async () => {
    fakeUsersService.findOneById = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(
      new NotFoundException('User not found'),
    );
  });

  it('signin updtes session object and return suer', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      {
        email: 'test@test.com',
        password: 'test',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
