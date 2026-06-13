'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(state: { error: string } | undefined, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === 'admin@mysolar-pv.de' && password === 'changethislater123') {
    const cookieStore = await cookies();
    // `secure: true` is only honored over HTTPS, so the cookie silently fails
    // on plain-HTTP localhost and the user bounces back to the login page.
    // Toggle it by environment instead.
    cookieStore.set('admin_token', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    redirect('/admin/calculator');
  } else {
    return { error: 'Invalid username or password' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
