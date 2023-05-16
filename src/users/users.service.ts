import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOneById(id: number) {
    return this.repo.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.repo.findBy({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user)
      throw new NotFoundException(`There is no user with the id: ${id}`);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user)
      throw new NotFoundException(`There is no user with the id: ${id}`);

    return this.repo.remove(user);
  }
}
