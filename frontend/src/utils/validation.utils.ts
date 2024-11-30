import { Schema, ZodTypeDef } from 'zod';

export function validateForm<T, D extends ZodTypeDef, V>(form: HTMLFormElement, schema: Schema<T, D, V>): T {
  const formData = new FormData(form);

  return schema.parse(Object.fromEntries(formData));
}
