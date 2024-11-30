import { Container } from 'inversify';

import { authModule } from '@modules/auth';
import { coreModule, DatabaseClient } from '@modules/core';
import { costsModule } from '@modules/costs';
import { departmentsModule } from '@modules/departments';
import { issueManagementModule } from '@modules/issue-management';
import { projectsModule } from '@modules/projects';
import { usersModule } from '@modules/users';

export async function initializeContainer(): Promise<Container> {
  const modules = [
    projectsModule,
    usersModule,
    coreModule,
    authModule,
    departmentsModule,
    issueManagementModule,
    costsModule,
  ];

  const serverContainer = new Container();

  for (const containerModule of modules) {
    await serverContainer.loadAsync(containerModule);
  }

  const db = serverContainer.get(DatabaseClient);
  await db.connect();
  await db.migrate();

  return serverContainer;
}
