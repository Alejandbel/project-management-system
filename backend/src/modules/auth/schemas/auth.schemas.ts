import { z } from 'zod';

export const signUpBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
  })
  .strip()
  .required();

export const signInBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strip()
  .required();
