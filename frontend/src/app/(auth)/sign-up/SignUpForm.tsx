'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { FormEvent } from 'react';
import { z } from 'zod';

import { authService } from '@/services/api';
import { validateForm } from '@/utils';

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
  })
  .strip()
  .required();

export default function SignUpForm() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = validateForm(event.currentTarget, signUpSchema);

    await authService.signUp(data);
    window.location.href = '/';
  }

  return (
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
        <span className="text-600 font-medium line-height-3">Already have an account?</span>
        <Link href="/sign-in" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          Sign in!
        </Link>
      </div>

      <form onSubmit={onSubmit}>
        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
        <InputText id="email" name="email" type="text" placeholder="Email address" className="w-full mb-3" />

        <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
        <InputText id="name" name="name" type="text" placeholder="Name" className="w-full mb-3" />

        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
        <InputText id="password" name="password" type="password" placeholder="Password" className="w-full mb-3" />

        <Button type="submit" label="Sign Up" icon="pi pi-user" className="w-full" />
      </form>
    </div>
  );
}
