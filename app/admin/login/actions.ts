'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(state: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === 'admin@mysolar-pv.de' && password === 'changethislater123') {
    const cookieStore = await cookies();
    cookieStore.set('admin_token', 'true', { secure: true, httpOnly: true });
    redirect('/admin/installers');
  } else {
    return { error: 'Invalid username or password' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  redirect('/admin/login');
}
