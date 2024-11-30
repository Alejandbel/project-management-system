import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { UserSalariesRepository } from '../repositories';
import { SalaryOptions, SalaryToUpdate, UserSalary, UserSalaryWithUser } from '../types';

@injectable()
export class UserSalariesService {
  @inject(UserSalariesRepository) private readonly userSalariesRepository: UserSalariesRepository;

  async findOrCreate({ year, month }: SalaryOptions): Promise<UserSalaryWithUser[]> {
    const period = new Date(Date.UTC(year, month));
    let salaries = await this.userSalariesRepository.findByPeriod(period);
    if (!salaries?.length) {
      await this.userSalariesRepository.insertSalariesForAllUsers(period);
      salaries = await this.userSalariesRepository.findByPeriod(period);
    }

    return salaries;
  }

  async updateOne(id: number, salaryToUpdate: SalaryToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.userSalariesRepository.updateById(id, salaryToUpdate);
  }

  async findOneOrFail(options: Partial<UserSalary>): Promise<UserSalary> {
    const version = await this.userSalariesRepository.findOne(options);

    if (!version) {
      throw new EntityNotFoundError('Version');
    }

    return version;
  }
}
