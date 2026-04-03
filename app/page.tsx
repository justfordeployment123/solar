'use client';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Persona } from '@/types/calculator';

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
      <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md flex justify-center items-center w-full px-8 py-12 max-w-screen-2xl mx-auto z-50">
        <div className="flex items-center">
          <span className="text-2xl font-semibold tracking-tighter text-black dark:text-white uppercase">BatteryCalc</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-screen-xl px-8 py-20">
        <div className="w-full text-center mb-24">
          <h1 className="text-[3.5rem] md:text-[5rem] font-semibold leading-none tracking-tighter text-black mb-4">
            Who are you?
          </h1>
          <p className="text-[1rem] font-regular text-[#777777] uppercase tracking-widest">
            Select your path to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          {/* Card A */}
          <button onClick={() => handleSelect('Private')} className="group text-left border border-[#c6c6c6] p-12 transition-all duration-300 hover:border-black flex flex-col justify-between aspect-square">
            <div className="flex flex-col gap-6">
              <span className="material-symbols-outlined text-4xl text-black">person</span>
              <h3 className="text-2xl font-bold tracking-tight text-black">I am a private individual.</h3>
            </div>
            <div className="mt-8">
              <span className="text-[0.75rem] font-semibold uppercase tracking-widest group-hover:underline underline-offset-8">Select →</span>
            </div>
          </button>

          {/* Card B */}
          <button onClick={() => handleSelect('Installer')} className="group text-left border border-[#c6c6c6] p-12 transition-all duration-300 hover:border-black flex flex-col justify-between aspect-square">
            <div className="flex flex-col gap-6">
              <span className="material-symbols-outlined text-4xl text-black">solar_power</span>
              <h3 className="text-2xl font-bold tracking-tight text-black">I am an installer selling photovoltaic systems.</h3>
            </div>
            <div className="mt-8">
              <span className="text-[0.75rem] font-semibold uppercase tracking-widest group-hover:underline underline-offset-8">Select →</span>
            </div>
          </button>

          {/* Card C */}
          <button onClick={() => handleSelect('Company')} className="group text-left border border-[#c6c6c6] p-12 transition-all duration-300 hover:border-black flex flex-col justify-between aspect-square">
            <div className="flex flex-col gap-6">
              <span className="material-symbols-outlined text-4xl text-black">corporate_fare</span>
              <h3 className="text-2xl font-bold tracking-tight text-black">I am a company looking for an energy solution.</h3>
            </div>
            <div className="mt-8">
              <span className="text-[0.75rem] font-semibold uppercase tracking-widest group-hover:underline underline-offset-8">Select →</span>
            </div>
          </button>
        </div>

        <div className="mt-32 w-full flex justify-center">
          <div className="w-12 h-[1px] bg-[#c6c6c6]"></div>
        </div>
      </main>

      <footer className="bg-white flex flex-col md:flex-row justify-center items-center gap-12 w-full py-20 px-8">
        <div className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#777777]">
            © 2024 BatteryCalc
        </div>
        <nav className="flex gap-12">
          <a href="#" className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#777777] hover:text-black transition-colors cursor-pointer">
              Impressum
          </a>
          <a href="#" className="text-[0.75rem] font-semibold uppercase tracking-widest text-[#777777] hover:text-black transition-colors cursor-pointer">
              Visit our homepage
          </a>
        </nav>
      </footer>
    </div>
  );
}
