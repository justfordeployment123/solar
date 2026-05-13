'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleInstallerStatus(id: string, targetStatus: boolean) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('installers')
    .update({ is_active: targetStatus })
    .eq('id', id);

  if (error) {
    console.error('Error toggling status:', error);
    throw new Error('Failed to toggle status');
  }

  revalidatePath('/admin/installers');
}

export async function updatePaymentStatus(id: string, status: string) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from('installers')
    .update({ payment_status: status })
    .eq('id', id);

  if (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status');
  }

  revalidatePath('/admin/installers');
}
