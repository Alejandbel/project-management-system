import { UserWithRole } from '@modules/users';

export type InFlightUser = Pick<UserWithRole, 'id' | 'role'>;
