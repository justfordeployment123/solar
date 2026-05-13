import { createServerSupabaseClient } from '@/lib/supabase/server';

export const revalidate = 0; // Disable caching for this page

export default async function LeadsPage() {
  const supabase = createServerSupabaseClient();
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*, installers(company_name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return <div className="p-8 text-brand-red">Failed to load leads.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-dark-gray">Leads</h1>
      </div>

      <div className="bg-brand-white rounded-lg shadow-sm border border-brand-lighter-gray overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-lighter-gray/50 border-b border-brand-lighter-gray">
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Date</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Name</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Email</th>
              <th className="p-4 font-semibold text-brand-dark-gray text-sm">Installer Page</th>
            </tr>
          </thead>
          <tbody>
            {leads?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-brand-light-gray">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads?.map((lead) => (
                <tr key={lead.id} className="border-b border-brand-lighter-gray last:border-0 hover:bg-brand-lighter-gray/20 transition-colors">
                  <td className="p-4 text-brand-light-gray text-sm">{formatDate(lead.created_at)}</td>
                  <td className="p-4 text-brand-dark-gray font-medium">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="p-4 text-brand-light-gray">{lead.email}</td>
                  <td className="p-4 text-brand-light-gray font-mono text-xs">
                    {lead.installers ? lead.installers.company_name : '-'}
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
