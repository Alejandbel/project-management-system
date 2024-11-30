import { inject, injectable } from 'inversify';

import { IssueStatusesRepository } from '../repositories';
import { IssueStatus } from '../types';

@injectable()
export class IssueStatusesService {
  @inject(IssueStatusesRepository) private readonly issueStatusesRepository: IssueStatusesRepository;

  async find(): Promise<IssueStatus[]> {
    return this.issueStatusesRepository.find();
  }
}
