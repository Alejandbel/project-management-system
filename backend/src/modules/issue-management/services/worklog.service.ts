import { inject, injectable } from 'inversify';

import { WorklogsRepository } from '../repositories';
import { Worklog } from '../types';

@injectable()
export class WorklogService {
  @inject(WorklogsRepository) private readonly issuesRepository: WorklogsRepository;

  async create(worklog: Pick<Worklog, 'issueId' | 'authorId' | 'timeSpent'>): Promise<number> {
    return this.issuesRepository.create(worklog);
  }
}
