import { inject } from 'inversify';
import { BaseHttpController, controller, httpPost, IHttpActionResult, requestBody } from 'inversify-express-utils';

import { AuthorizedMiddleware } from '@modules/auth/middlewares';
import { applyBodyValidation } from '@modules/core';

import { createWorklogBodySchema } from '../schemas';
import { WorklogService } from '../services';
import { Worklog } from '../types';

@controller('/worklogs')
export class WorklogsController extends BaseHttpController {
  @inject(WorklogService) private readonly worklogService: WorklogService;

  @httpPost('/', AuthorizedMiddleware, applyBodyValidation(createWorklogBodySchema))
  async createWorklog(@requestBody() worklog: Pick<Worklog, 'timeSpent' | 'issueId'>): Promise<IHttpActionResult> {
    const userId = this.httpContext.request.user!.id;
    await this.worklogService.create({ authorId: userId, ...worklog });
    return this.ok();
  }
}
