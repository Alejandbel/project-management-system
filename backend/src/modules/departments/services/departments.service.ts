import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { DepartmentsRepository } from '../repositories';
import { Department, DepartmentListOptions, DepartmentToUpdate } from '../types';

@injectable()
export class DepartmentsService {
  @inject(DepartmentsRepository) private readonly departmentsRepository: DepartmentsRepository;

  async findWithCount(options: DepartmentListOptions): Promise<[Department[], number]> {
    return this.departmentsRepository.findWithCount({}, options);
  }

  async updateOne(id: number, departmentToUpdate: DepartmentToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.departmentsRepository.updateById(id, departmentToUpdate);
  }

  async deleteOne(id: number): Promise<void> {
    await this.findOneOrFail({ id });
    await this.departmentsRepository.deleteById(id);
  }

  async create(department: Pick<Department, 'title'>): Promise<number> {
    return this.departmentsRepository.create(department);
  }

  async findOneOrFail(options: Partial<Department>): Promise<Department> {
    const department = await this.departmentsRepository.findOne(options);

    if (!department) {
      throw new EntityNotFoundError('Department');
    }

    return department;
  }
}
