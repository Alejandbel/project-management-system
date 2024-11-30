import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  IHttpActionResult,
  queryParam,
  requestBody,
  requestParam,
} from 'inversify-express-utils';

import { AuthorizedMiddleware, roles } from '@modules/auth/middlewares';
import {
  applyBodyValidation,
  applyParamsValidation,
  applyQueryValidation,
  idParamsSchema,
  ParamsId,
} from '@modules/core';
import { EMPLOYEE_ROLE } from '@modules/users';

import { createVersionBodySchema, getVersionListQuerySchema, updateVersionBodySchema } from '../schemas';
import { VersionsService } from '../services';
import { VersionListOptions, VersionToCreate } from '../types';

@controller('/versions')
export class VersionsController extends BaseHttpController {
  @inject(VersionsService) private readonly versionsService: VersionsService;

  @httpGet('/', AuthorizedMiddleware, applyQueryValidation(getVersionListQuerySchema))
  async getVersionList(@queryParam() query: VersionListOptions): Promise<IHttpActionResult> {
    const [items, count] = await this.versionsService.findWithCount(query);
    return this.json({ items, count });
  }

  @httpPost(
    '/',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.ADMIN, EMPLOYEE_ROLE.PROJECT_MANAGER]),
    applyBodyValidation(createVersionBodySchema),
  )
  async createVersion(@requestBody() versionToUpdate: VersionToCreate): Promise<IHttpActionResult> {
    await this.versionsService.create(versionToUpdate);
    return this.ok();
  }

  @httpPatch(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.PROJECT_MANAGER, EMPLOYEE_ROLE.ADMIN]),
    applyParamsValidation(idParamsSchema),
    applyBodyValidation(updateVersionBodySchema),
  )
  async updateVersion(
    @requestParam() { id }: ParamsId,
    @requestBody() version: Required<VersionToCreate>,
  ): Promise<IHttpActionResult> {
    await this.versionsService.updateOne(id, version);
    return this.ok();
  }

  @httpDelete(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.ADMIN, EMPLOYEE_ROLE.PROJECT_MANAGER]),
    applyParamsValidation(idParamsSchema),
  )
  async deleteVersion(@requestParam() { id }: ParamsId): Promise<IHttpActionResult> {
    await this.versionsService.deleteOne(id);
    return this.ok();
  }
}
