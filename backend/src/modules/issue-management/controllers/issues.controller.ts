import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpPatch,
  httpPost,
  IHttpActionResult,
  requestBody,
  requestParam,
} from 'inversify-express-utils';

import { AuthorizedMiddleware, roles } from '@modules/auth/middlewares';
import { applyBodyValidation, applyParamsValidation, idParamsSchema, ParamsId } from '@modules/core';
import { EMPLOYEE_ROLE } from '@modules/users';

import { createIssueBodySchema, updateIssueBodySchema } from '../schemas';
import { IssuesService } from '../services';
import { IssueToCreate, IssueToUpdate } from '../types';

@controller('/issues')
export class IssuesController extends BaseHttpController {
  @inject(IssuesService) private readonly issuesService: IssuesService;

  @httpPost(
    '/',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.ADMIN, EMPLOYEE_ROLE.PROJECT_MANAGER]),
    applyBodyValidation(createIssueBodySchema),
  )
  async createIssue(@requestBody() issueToCreate: IssueToCreate): Promise<IHttpActionResult> {
    await this.issuesService.create(issueToCreate);
    return this.ok();
  }

  @httpPatch(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.PROJECT_MANAGER, EMPLOYEE_ROLE.ADMIN]),
    applyParamsValidation(idParamsSchema),
    applyBodyValidation(updateIssueBodySchema),
  )
  async updateIssue(
    @requestParam() { id }: ParamsId,
    @requestBody() issueToUpdate: IssueToUpdate,
  ): Promise<IHttpActionResult> {
    await this.issuesService.updateOne(id, issueToUpdate);
    return this.ok();
  }
}
