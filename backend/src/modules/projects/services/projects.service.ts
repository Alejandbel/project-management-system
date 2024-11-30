import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';
import { DepartmentsService } from '@modules/departments';
import { UsersService } from '@modules/users';

import { ProjectsRepository } from '../repositories';
import { Project, ProjectListOptions, ProjectToCreate, ProjectToUpdate } from '../types';

@injectable()
export class ProjectsService {
  @inject(ProjectsRepository) private readonly projectsRepository: ProjectsRepository;
  @inject(DepartmentsService) private readonly departmentsService: DepartmentsService;
  @inject(UsersService) private readonly usersService: UsersService;

  async findWithCount(options: ProjectListOptions): Promise<[Project[], number]> {
    return Promise.all([
      this.projectsRepository.findWithRelations(
        {
          departmentId: options.departmentId,
        },
        options,
      ),
      this.projectsRepository.count({
        departmentId: options.departmentId,
      }),
    ]);
  }

  async updateOne(id: number, projectToUpdate: ProjectToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.validateProjectFields(projectToUpdate);

    await this.projectsRepository.updateById(id, projectToUpdate);
  }

  async create(projectToCreate: ProjectToCreate): Promise<number> {
    await this.validateProjectFields(projectToCreate);
    return this.projectsRepository.create(projectToCreate);
  }

  private async validateProjectFields(projectToUpdate: ProjectToUpdate): Promise<void> {
    projectToUpdate.departmentId && (await this.departmentsService.findOneOrFail({ id: projectToUpdate.departmentId }));
    projectToUpdate.leadId && (await this.usersService.findOneOrFail({ id: projectToUpdate.leadId }));
  }

  async findOneOrFail(options: Partial<Project>): Promise<Project> {
    const project = await this.projectsRepository.findOne(options);

    if (!project) {
      throw new EntityNotFoundError('Project');
    }

    return project;
  }
}
