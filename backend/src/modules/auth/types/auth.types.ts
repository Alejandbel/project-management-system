import { z } from 'zod';

import { signInBodySchema, signUpBodySchema } from '../schemas';

export type SignUpUser = z.infer<typeof signUpBodySchema>;
export type SignInUser = z.infer<typeof signInBodySchema>;
