import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, IHttpActionResult } from 'inversify-express-utils';

import { AuthorizedMiddleware } from '@modules/auth/middlewares';

import { IssueStatusesService } from '../services';

@controller('/issue-statuses')
export class IssueStatusesController extends BaseHttpController {
  @inject(IssueStatusesService) private readonly issueStatusesService: IssueStatusesService;

  @httpGet('/', AuthorizedMiddleware)
  async getIssueTypes(): Promise<IHttpActionResult> {
    const items = await this.issueStatusesService.find();
    return this.json({ items });
  }
}
