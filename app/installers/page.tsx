import Link from 'next/link';

export default function InstallersPage() {
  return (
    <div className="bg-white min-h-screen text-[#1a1c1c] font-inter">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-10 py-8 border-b-0">
        <Link href="/" className="text-xl font-bold uppercase tracking-widest text-black">
          SolarInstall<span className="text-[#a1a1aa] ml-2">Partner Portal</span>
        </Link>
        <Link href="/" className="text-[#5e5e5e] hover:text-black transition-colors text-sm font-bold uppercase tracking-widest">
          Cancel
        </Link>
      </header>

      <main className="pt-40 max-w-screen-lg mx-auto px-8 pb-32">
        <header className="mb-24">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6">Partner Registration</h1>
          <p className="text-xl text-[#777777] max-w-2xl leading-relaxed">
            Create your white-labeled instance of the battery storage calculator. Enter your company details below to generate a customized tool for your clients.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-12 gap-24">
          {/* Form Area */}
          <form className="md:col-span-8 flex flex-col gap-12" action="/installers/success">
            {/* Input Group: Company Name */}
            <div className="space-y-4">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="companyName">Company Name</label>
              <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="companyName" name="companyName" placeholder="Energy Solutions GmbH" type="text" required />
            </div>

            {/* Input Group: Contact Numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="tel">Telephone Number</label>
                <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="tel" name="tel" placeholder="+44 ..." type="tel"/>
              </div>
              <div className="group">
                <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="mobile">Mobile Number</label>
                <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="mobile" name="mobile" placeholder="+44 ..." type="tel"/>
              </div>
            </div>

            <div className="group">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777] mb-1" htmlFor="email">Email Address</label>
              <input className="w-full border-0 border-b border-[#c6c6c6] bg-transparent py-4 text-lg focus:ring-0 focus:border-black focus:border-b-2 transition-all placeholder:text-[#d4d4d4]" id="email" name="email" placeholder="admin@company.com" type="email" required />
            </div>

            {/* File Upload Area */}
            <div className="space-y-4 pt-4">
              <label className="block text-[0.75rem] font-bold uppercase tracking-wider text-[#777777]">Company Logo</label>
              <div className="border border-dashed border-[#c6c6c6] p-12 text-center hover:border-black transition-colors cursor-pointer group">
                <input className="hidden" id="logo-upload" type="file"/>
                <label className="cursor-pointer" htmlFor="logo-upload">
                  <span className="material-symbols-outlined text-4xl text-[#777777] group-hover:text-black mb-4">cloud_upload</span>
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-[0.6875rem] text-[#777777] mt-2 uppercase tracking-tight">SVG, PNG, or JPG (Max 2MB)</p>
                </label>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button className="w-full md:w-auto px-12 py-5 bg-black text-white font-bold text-lg hover:bg-[#1a1c1c] border border-black transition-all duration-300 group flex items-center justify-center gap-4" type="submit">
                Generate My Calculator
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Sidebar / Metadata */}
          <aside className="md:col-span-4 space-y-12">
            <div className="space-y-4">
              <p className="text-[0.75rem] font-bold uppercase tracking-widest text-[#777777]">Visual Preview</p>
              <div className="aspect-square bg-[#f3f3f4] flex items-center justify-center relative border border-[#c6c6c6]">
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#c6c6c6] text-6xl">image</span>
                </div>
                <span className="material-symbols-outlined text-[#777777] text-3xl z-10 relative">add_a_photo</span>
              </div>
              <p className="text-[0.6875rem] text-[#777777] leading-relaxed italic">
                This logo will appear on the customized calculator interface shared with your clients.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <p className="text-[0.75rem] font-bold uppercase tracking-widest text-[#777777]">Benefits</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm pt-1">check</span>
                  <span className="text-sm font-medium">White-label branding for all PDF exports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm pt-1">check</span>
                  <span className="text-sm font-medium">Custom localized installation costs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm pt-1">check</span>
                  <span className="text-sm font-medium">Lead generation dashboard access</span>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>

      <footer className="w-full max-w-screen-2xl mx-auto px-10 py-12 flex justify-between items-center text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#777777] border-t border-[#c6c6c6]/30">
        <div>© 2024 SOLARINSTALL PORTAL</div>
        <div className="flex gap-8">
          <Link className="hover:text-black transition-colors" href="#">Privacy</Link>
          <Link className="hover:text-black transition-colors" href="#">Terms</Link>
          <Link className="hover:text-black transition-colors" href="#">Support</Link>
        </div>
      </footer>
    </div>
  );
}
