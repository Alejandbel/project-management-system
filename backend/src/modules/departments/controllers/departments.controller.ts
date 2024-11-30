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

import { createDepartmentBodySchema, getDepartmentListQuerySchema, updateDepartmentBodySchema } from '../schemas';
import { DepartmentsService } from '../services';
import { DepartmentListOptions, DepartmentToUpdate } from '../types';

@controller('/departments')
export class DepartmentsController extends BaseHttpController {
  @inject(DepartmentsService) private readonly departmentsService: DepartmentsService;

  @httpGet('/', AuthorizedMiddleware, applyQueryValidation(getDepartmentListQuerySchema))
  async getDepartmentList(@queryParam() query: DepartmentListOptions): Promise<IHttpActionResult> {
    const [items, count] = await this.departmentsService.findWithCount(query);
    return this.json({ items, count });
  }

  @httpPost('/', AuthorizedMiddleware, roles([EMPLOYEE_ROLE.ADMIN]), applyBodyValidation(createDepartmentBodySchema))
  async createDepartment(@requestBody() departmentToUpdate: DepartmentToUpdate): Promise<IHttpActionResult> {
    await this.departmentsService.create(departmentToUpdate);
    return this.ok();
  }

  @httpPatch(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.ADMIN]),
    applyParamsValidation(idParamsSchema),
    applyBodyValidation(updateDepartmentBodySchema),
  )
  async updateDepartment(
    @requestParam() { id }: ParamsId,
    @requestBody() department: Required<DepartmentToUpdate>,
  ): Promise<IHttpActionResult> {
    await this.departmentsService.updateOne(id, department);
    return this.ok();
  }

  @httpDelete('/:id', AuthorizedMiddleware, roles([EMPLOYEE_ROLE.ADMIN]), applyParamsValidation(idParamsSchema))
  async deleteDepartment(@requestParam() { id }: ParamsId): Promise<IHttpActionResult> {
    await this.departmentsService.deleteOne(id);
    return this.ok();
  }
}
