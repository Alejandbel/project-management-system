'use client';

import Link from 'next/link';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { FormEvent } from 'react';
import { z } from 'zod';

import { authService } from '@/services/api';
import { validateForm } from '@/utils';
import { handleAxiosErrorMessageToast } from '@/utils/toast.utils';

const signInSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strip()
  .required();

export default function SignInForm() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = validateForm(event.currentTarget, signInSchema);

    try {
      await authService.signIn(data);
      window.location.href = '/';
    } catch (error) {
      handleAxiosErrorMessageToast(error);
    }
  }

  return (
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div className="text-center mb-5">
        <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
        <span className="text-600 font-medium line-height-3">Don&lsquo;t have an account?</span>
        <Link href="/sign-up" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
          Create today!
        </Link>
      </div>

      <form onSubmit={onSubmit}>
        <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
        <InputText id="email" name="email" type="text" placeholder="Email address" className="w-full mb-3" />

        <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
        <InputText id="password" name="password" type="password" placeholder="Password" className="w-full mb-3" />

        <Button label="Sign In" icon="pi pi-user" className="w-full" />
      </form>
    </div>
  );
}
