import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
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

import { createProjectBodySchema, getProjectsListQuerySchema, updateProjectBodySchema } from '../schemas';
import { ProjectsService } from '../services';
import { ProjectListOptions, ProjectToCreate, ProjectToUpdate } from '../types';

@controller('/projects')
export class ProjectsController extends BaseHttpController {
  @inject(ProjectsService) private readonly projectsService: ProjectsService;

  @httpGet('/', AuthorizedMiddleware, applyQueryValidation(getProjectsListQuerySchema))
  async getProjectsList(@queryParam() query: ProjectListOptions): Promise<IHttpActionResult> {
    const [items, count] = await this.projectsService.findWithCount(query);
    return this.json({ items, count });
  }

  @httpGet('/:id', AuthorizedMiddleware, applyParamsValidation(idParamsSchema))
  async getProject(@requestParam() { id }: ParamsId): Promise<IHttpActionResult> {
    const project = await this.projectsService.findOneOrFail({ id });
    return this.json(project);
  }

  @httpPost(
    '/',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.PROJECT_MANAGER, EMPLOYEE_ROLE.ADMIN]),
    applyBodyValidation(createProjectBodySchema),
  )
  async createProject(@requestBody() project: ProjectToCreate): Promise<IHttpActionResult> {
    await this.projectsService.create(project);
    return this.ok();
  }

  @httpPatch(
    '/:id',
    AuthorizedMiddleware,
    roles([EMPLOYEE_ROLE.PROJECT_MANAGER, EMPLOYEE_ROLE.ADMIN]),
    applyParamsValidation(idParamsSchema),
    applyBodyValidation(updateProjectBodySchema),
  )
  async updateProject(
    @requestParam() { id }: ParamsId,
    @requestBody() project: ProjectToUpdate,
  ): Promise<IHttpActionResult> {
    await this.projectsService.updateOne(id, project);
    return this.ok();
  }
}
