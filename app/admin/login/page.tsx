'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-lighter-gray p-4">
      <div className="w-full max-w-md bg-brand-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-red p-3 rounded-full mb-4">
            <LogIn className="w-6 h-6 text-brand-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark-gray">Admin Portal</h1>
          <p className="text-brand-light-gray mt-2">Sign in to your account</p>
        </div>

        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark-gray mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full px-3 py-2 border border-brand-lighter-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red text-brand-dark-gray"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark-gray mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-brand-lighter-gray rounded-md focus:outline-none focus:ring-2 focus:ring-brand-red text-brand-dark-gray"
            />
          </div>

          {state?.error && (
            <div className="text-brand-red text-sm font-medium">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-brand-red text-brand-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
