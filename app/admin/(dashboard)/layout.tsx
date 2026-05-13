import { Users, FileText, LogOut } from 'lucide-react';
import Link from 'next/link';
import { logoutAction } from '../login/actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-brand-lighter-gray">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-white border-r border-brand-lighter-gray flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-brand-lighter-gray">
          <h1 className="text-lg font-bold text-brand-dark-gray">Admin Portal</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            href="/admin/installers" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-brand-light-gray hover:text-brand-red hover:bg-brand-lighter-gray transition-colors"
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Installers</span>
          </Link>
          <Link 
            href="/admin/leads" 
            className="flex items-center gap-3 px-3 py-2 rounded-md text-brand-light-gray hover:text-brand-red hover:bg-brand-lighter-gray transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Leads</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-brand-lighter-gray">
          <form action={logoutAction}>
            <button 
              type="submit"
              className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-brand-light-gray hover:text-brand-red hover:bg-brand-lighter-gray transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
