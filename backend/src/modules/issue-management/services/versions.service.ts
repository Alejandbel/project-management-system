import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { VersionsRepository } from '../repositories';
import { Version, VersionListOptions, VersionWithIssues, VersionToCreate } from '../types';

@injectable()
export class VersionsService {
  @inject(VersionsRepository) private readonly versionsRepository: VersionsRepository;

  async findWithCount(options: VersionListOptions): Promise<[VersionWithIssues[], number]> {
    return Promise.all([
      this.versionsRepository.findWithIssues({ projectId: options.projectId }, options),
      this.versionsRepository.count({ projectId: options.projectId }),
    ]);
  }

  async updateOne(id: number, versionToUpdate: VersionToCreate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.versionsRepository.updateById(id, versionToUpdate);
  }

  async deleteOne(id: number): Promise<void> {
    await this.findOneOrFail({ id });
    await this.versionsRepository.deleteById(id);
  }

  async create(version: Pick<Version, 'title'>): Promise<number> {
    return this.versionsRepository.create(version);
  }

  async findOneOrFail(options: Partial<Version>): Promise<Version> {
    const version = await this.versionsRepository.findOne(options);

    if (!version) {
      throw new EntityNotFoundError('Version');
    }

    return version;
  }
}
