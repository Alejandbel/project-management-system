import { inject, injectable } from 'inversify';

import { EntityNotFoundError } from '@modules/core';

import { IssuesRepository } from '../repositories';
import { Issue, IssueToCreate, IssueToUpdate } from '../types';

@injectable()
export class IssuesService {
  @inject(IssuesRepository) private readonly issuesRepository: IssuesRepository;

  async updateOne(id: number, issueToUpdate: IssueToUpdate): Promise<void> {
    await this.findOneOrFail({ id });
    await this.issuesRepository.updateById(id, issueToUpdate);
  }

  async create(issue: IssueToCreate): Promise<number> {
    return this.issuesRepository.create(issue);
  }

  async findOneOrFail(options: Partial<Issue>): Promise<Issue> {
    const issue = await this.issuesRepository.findOne(options);

    if (!issue) {
      throw new EntityNotFoundError('Issue');
    }

    return issue;
  }
}
