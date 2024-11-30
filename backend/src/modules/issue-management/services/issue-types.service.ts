import { inject, injectable } from 'inversify';

import { IssueTypesRepository } from '../repositories';
import { IssueType } from '../types';

@injectable()
export class IssueTypesService {
  @inject(IssueTypesRepository) private readonly issueTypesRepository: IssueTypesRepository;

  async find(): Promise<IssueType[]> {
    return this.issueTypesRepository.find();
  }
}
