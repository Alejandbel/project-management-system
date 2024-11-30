import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpGet,
  httpPatch,
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
import { SalaryOptions, SalaryToUpdate } from '@modules/costs';
import { EMPLOYEE_ROLE } from '@modules/users';

import { getSalariesQuerySchema, updateSalaryBodySchema } from '../schemas';
import { UserSalariesService } from '../services';

@controller('/user-salaries')
export class UserSalariesController extends BaseHttpController {
  @inject(UserSalariesService) private readonly userSalariesService: UserSalariesService;

  @httpGet(
    '/',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.ADMIN]),
    applyQueryValidation(getSalariesQuerySchema),
  )
  async getSalaries(@queryParam() query: SalaryOptions): Promise<IHttpActionResult> {
    const items = await this.userSalariesService.findOrCreate(query);
    return this.json({ items });
  }

  @httpPatch(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.ADMIN]),
    applyParamsValidation(idParamsSchema),
    applyBodyValidation(updateSalaryBodySchema),
  )
  async updateSalary(
    @requestParam() { id }: ParamsId,
    @requestBody() version: SalaryToUpdate,
  ): Promise<IHttpActionResult> {
    await this.userSalariesService.updateOne(id, version);
    return this.ok();
  }
}
