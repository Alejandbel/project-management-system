import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { UsersRepository } from '../repositories';
import { User, UsersListOptions, UserToUpdate, UserWithRole } from '../types';

import { EmployeeRolesService } from './employee-roles.service';

@injectable()
export class UsersService {
  @inject(UsersRepository) private readonly usersRepository: UsersRepository;
  @inject(EmployeeRolesService) private readonly employeeRolesService: EmployeeRolesService;

  async findWithRolesWithCount(options: UsersListOptions): Promise<[UserWithRole[], number]> {
    return Promise.all([this.usersRepository.findWithRoles({}, options), this.usersRepository.count()]);
  }

  async findOne(options: Partial<User>): Promise<User | undefined> {
    return this.usersRepository.findOne(options);
  }

  async findOneWithRoleOrFail(options: Partial<User>): Promise<UserWithRole> {
    const user = await this.usersRepository.findOneWithRole(options);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    return user;
  }

  async updateOne(id: number, user: UserToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    if (user.roleId) {
      await this.employeeRolesService.findOneOrFail({ id: user.roleId });
    }
    await this.usersRepository.updateById(id, user);
  }

  async create(user: Pick<User, 'email' | 'password' | 'name'>): Promise<number> {
    const userId = await this.usersRepository.create(user);

    return userId;
  }

  async findOneOrFail(options: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne(options);

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    return user;
  }
}
