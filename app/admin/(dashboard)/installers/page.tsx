import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ToggleStatus } from './ToggleStatus';
import { PaymentStatusDropdown } from './PaymentStatusDropdown';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const revalidate = 0; // Disable caching for this page

export default async function InstallersPage() {
  const supabase = createServerSupabaseClient();
  const { data: installers, error } = await supabase
    .from('installers')
    .select('*, leads(count)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching installers:', error);
    return <div className="p-8 text-brand-red">Failed to load installers.</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-dark-gray">Installers</h1>
      </div>

      <div className="bg-brand-white rounded-lg shadow-sm border border-brand-lighter-gray overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-lighter-gray/50 border-b border-brand-lighter-gray">
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Company Name</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Contact</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Link</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Leads</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Status</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {installers?.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-brand-light-gray">
                  No installers found.
                </td>
              </tr>
            ) : (
              installers?.map((installer) => (
                <tr key={installer.id} className="border-b border-brand-lighter-gray last:border-0 hover:bg-brand-lighter-gray/20 transition-colors">
                  <td className="p-4 text-brand-dark-gray font-medium">{installer.company_name}</td>
                  <td className="p-4 text-brand-light-gray">{installer.contact_name}</td>
                  <td className="p-4 text-brand-light-gray font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="truncate w-24 block" title={installer.generated_slug}>
                        {installer.generated_slug}
                      </span>
                      <Link 
                        href={`/i/${installer.generated_slug}/step-1`} 
                        target="_blank"
                        className="text-brand-light-gray hover:text-brand-red transition-colors"
                        title="Visit Calculator"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                  <td className="p-4 text-brand-light-gray font-mono text-sm">
                    {installer.leads && installer.leads[0] ? installer.leads[0].count : 0}
                  </td>
                  <td className="p-4">
                    <ToggleStatus id={installer.id} initialStatus={installer.is_active} />
                  </td>
                  <td className="p-4">
                     <PaymentStatusDropdown id={installer.id} currentStatus={installer.payment_status || 'pending'} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
