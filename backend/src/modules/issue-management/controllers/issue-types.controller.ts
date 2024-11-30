import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, IHttpActionResult } from 'inversify-express-utils';

import { AuthorizedMiddleware } from '@modules/auth/middlewares';

import { IssueTypesService } from '../services';

@controller('/issue-types')
export class IssueTypesController extends BaseHttpController {
  @inject(IssueTypesService) private readonly issueTypesService: IssueTypesService;

  @httpGet('/', AuthorizedMiddleware)
  async getIssueTypes(): Promise<IHttpActionResult> {
    const items = await this.issueTypesService.find();
    return this.json({ items });
  }
}
