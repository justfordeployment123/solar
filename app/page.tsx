'use client';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Persona } from '@/types/calculator';
import { User, Sun, Building } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const setPersona = useCalculatorStore((state) => state.setPersona);

  const handleSelect = (persona: Persona) => {
    setPersona(persona);
    if (persona === 'Installer') {
      router.push('/installers');
    } else {
      router.push('/calculator/step-1');
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center font-inter text-[#1a1c1c]">
      <main className="flex-grow flex flex-col items-center justify-center w-full px-8 pb-20 pt-10">
        <div className="w-full text-center mb-12 mt-8 md:mt-16">
          <h1 className="text-[3.5rem] md:text-[5rem] font-semibold leading-none tracking-tighter text-black mb-6">
            Who are you?
          </h1>
          <p className="text-[1rem] font-regular text-[#777777] uppercase tracking-widest mt-8">
            Select your path to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {/* Card A */}
          <button onClick={() => handleSelect('Private')} className="group text-left border border-[#c6c6c6] p-12 transition-all duration-300 hover:border-black flex flex-col justify-between aspect-square rounded-3xl">
            <div className="flex flex-col gap-6">
              <User className="w-9 h-9 text-black" />
              <h3 className="text-2xl font-bold tracking-tight text-black">I am a private individual.</h3>
            </div>
            <div className="mt-8">
              <span className="text-[0.75rem] font-semibold uppercase tracking-widest group-hover:underline underline-offset-8">Select →</span>
            </div>
          </button>

          {/* Card B */}
          <button onClick={() => handleSelect('Installer')} className="group text-left border border-[#c6c6c6] p-12 transition-all duration-300 hover:border-black flex flex-col justify-between aspect-square rounded-3xl">
            <div className="flex flex-col gap-6">
              <Sun className="w-9 h-9 text-black" />
              <h3 className="text-2xl font-bold tracking-tight text-black">I am an installer selling photovoltaic systems.</h3>
            </div>
            <div className="mt-8">
              <span className="text-[0.75rem] font-semibold uppercase tracking-widest group-hover:underline underline-offset-8">Select →</span>
            </div>
          </button>

          {/* Card C */}
          <button onClick={() => handleSelect('Company')} className="group text-left border border-[#c6c6c6] p-12 transition-all duration-300 hover:border-black flex flex-col justify-between aspect-square rounded-3xl">
            <div className="flex flex-col gap-6">
              <Building className="w-9 h-9 text-black" />
              <h3 className="text-2xl font-bold tracking-tight text-black">I am a company looking for an energy solution.</h3>
            </div>
            <div className="mt-8">
              <span className="text-[0.75rem] font-semibold uppercase tracking-widest group-hover:underline underline-offset-8">Select →</span>
            </div>
          </button>
        </div>

     
      </main>

      <footer className="bg-white flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-12 w-full pt-8 pb-8 px-8 border-t border-[#c6c6c6]/50 mt-auto">
        <div className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#777777]">
            © 2026 MySolar PV
        </div>
        <nav className="flex gap-12">
          <a href="#" className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#777777] hover:text-black transition-colors cursor-pointer">
              Visit our homepage
          </a>
        </nav>
      </footer>
    </div>
  );
}
