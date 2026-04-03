import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function InstallersSuccessPage() {
  return (
    <div className="bg-white min-h-screen text-[#1a1c1c] font-inter flex flex-col items-center justify-center">
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md flex justify-between items-center px-10 py-8 border-b-0">
        <Link href="/" className="text-xl font-bold uppercase tracking-widest text-black">
          SolarInstall<span className="text-[#a1a1aa] ml-2">Partner Portal</span>
        </Link>
      </header>

      <main className="w-full max-w-screen-md px-8 py-32 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mb-8 mx-auto" />
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-black mb-6">Success!</h1>
        <p className="text-xl text-[#777777] max-w-2xl mx-auto leading-relaxed mb-12">
          Your customized battery storage calculator has been successfully generated. You can now start sharing it with your clients.
        </p>

        <div className="bg-[#f9f9f9] border border-[#c6c6c6] p-8 mb-12 flex flex-col gap-4 font-mono text-sm max-w-lg mx-auto text-left break-all">
          <p className="text-neutral-500 uppercase tracking-widest font-sans font-bold text-xs">Your Unique Link:</p>
          <p className="text-black font-medium text-lg">https://featurenotyetmade.com/i/energy-solutions-gmbh</p>
        </div>

        <Link href="/calculator/step-1" className="inline-flex items-center justify-center px-12 py-5 bg-black text-white font-bold text-lg hover:bg-white hover:text-black border border-black transition-all duration-300 gap-4 rounded-full">
          Enter Your Calculator
          <ArrowRight className="w-6 h-6" />
        </Link>
      </main>

    </div>
  );
}
