import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { InstallerCheck } from '@/components/installer-check';
import { ClientLayout } from './client-layout';
import { ActiveInstaller } from '@/types/calculator';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('installers')
    .select('*')
    .eq('generated_slug', slug)
    .single();

  if (error || !data) {
    redirect('/');
  }

  if (data.is_active === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Revoked</h1>
          <p className="text-gray-600">This installer link is no longer active or has been disabled.</p>
        </div>
      </div>
    );
  }

  const installer: ActiveInstaller = {
    id: data.id,
    companyName: data.company_name,
    contactName: data.contact_name,
    email: data.email,
    phone: data.phone,
    logoUrl: data.logo_url,
    websiteUrl: data.website_url,
    generatedSlug: data.generated_slug,
  };

  return (
    <>
      <InstallerCheck installer={installer} />
      <ClientLayout>{children}</ClientLayout>
    </>
  );
}
