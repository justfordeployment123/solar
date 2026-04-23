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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-opensans text-[#1a1a1a]">
        <div className="flex w-full max-w-md h-[6px] mb-10">
          <div className="flex-1 bg-[#e20613]" />
          <div className="flex-1 bg-[#d2d700]" />
          <div className="flex-1 bg-[#ffdb00]" />
        </div>
        <div className="max-w-md text-center">
          <div className="inline-flex items-center gap-2 bg-[#fff5f5] border border-[#e20613]/20 px-3 py-1 mb-6">
            <span className="w-2 h-2 bg-[#e20613]" />
            <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#e20613]">
              Zugriff gesperrt
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] mb-4 leading-tight">
            Access Revoked
          </h1>
          <p className="text-[#5a5859] font-medium leading-relaxed">
            This installer link is no longer active or has been disabled.
          </p>
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
