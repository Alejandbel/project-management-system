import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, IHttpActionResult } from 'inversify-express-utils';

import { AuthorizedMiddleware } from '@modules/auth/middlewares';

import { EmployeeRolesService } from '../services';

@controller('/employee-roles')
export class EmployeeRolesController extends BaseHttpController {
  @inject(EmployeeRolesService) private readonly employeeRolesService: EmployeeRolesService;

  @httpGet('/', AuthorizedMiddleware)
  async getEmployeeRoleList(): Promise<IHttpActionResult> {
    const items = await this.employeeRolesService.find();
    return this.json({ items });
  }
}
