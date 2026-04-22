'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Persona } from '@/types/calculator';
import { User, Sun, Building, ArrowRight, BatteryMedium } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const setPersona = useCalculatorStore((state) => state.setPersona);
  const activeInstaller = useCalculatorStore((state) => state.activeInstaller);
  const setActiveInstaller = useCalculatorStore((state) => state.setActiveInstaller);

  useEffect(() => {
    setActiveInstaller(null);
  }, [setActiveInstaller]);

  const handleSelect = (persona: Persona) => {
    setPersona(persona);
    if (persona === 'Installer') {
      router.push('/installers');
    } else {
      router.push('/calculator/step-1');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-[#ffffff] min-h-screen flex flex-col items-center font-opensans text-[#363636] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[55vh] lg:h-[60vh] bg-[#e12029] -[3rem] sm:-[8rem] z-0 "></div>

      <main className="flex-grow flex flex-col items-center justify-center w-full px-6 pb-20 pt-8 md:pt-12 z-10 max-w-6xl mx-auto">
        
        <div 
             className="w-14 h-14 md:w-16 md:h-16 bg-white   flex items-center justify-center mb-6 md:mb-8"
        >
          <BatteryMedium className="w-7 h-7 md:w-8 md:h-8 text-[#e12029]" />
        </div>

        <div 
             className="w-full text-center mb-10 md:mb-16"
        >
          <h1 className="text-[3rem] md:text-[4.5rem] font-bold leading-tight tracking-tight text-white mb-6 ">
            Wer sind Sie?
          </h1>
          <p className="text-[0.95rem] md:text-[1.15rem] font-medium text-white max-w-2xl mx-auto bg-white/20 backdrop-blur-md py-3 px-6  border border-white/30  inline-block">
            Wählen Sie Ihr Profil aus, um Ihr Erlebnis mit dem Batteriespeicher-Rechner individuell anzupassen.
          </p>
        </div>

        <div 
           className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          {/* Card A */}
          <button 
               onClick={() => handleSelect('Private')} 
            className="group bg-white text-left p-6 md:p-10 -   hover: flex flex-col justify-between ] border-2 border-transparent hover:border-[#e12029]"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#dfdfdf]  flex items-center justify-center group-hover:bg-[#e12029]  ">
                <User className="w-6 h-6 md:w-7 md:h-7 text-[#e12029] group-hover:text-white  " />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#363636] mb-2 md:mb-3">Privatperson</h3>
                <p className="text-sm md:text-base text-[#565656] font-medium leading-relaxed">
                  Ich bin ein Eigenheimbesitzer und möchte meinen Energieverbrauch optimieren sowie meine Stromrechnung senken.
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center text-[#e12029] font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2   " />
            </div>
          </button>

          {/* Card B */}
          <button 
               onClick={() => handleSelect('Installer')} 
            className="group bg-white text-left p-6 md:p-10 -   hover: flex flex-col justify-between ] border-2 border-transparent hover:border-[#e12029]"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#dfdfdf]  flex items-center justify-center group-hover:bg-[#e12029]  ">
                <Sun className="w-6 h-6 md:w-7 md:h-7 text-[#e12029] group-hover:text-white  " />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#363636] mb-2 md:mb-3">Solarinstallateur</h3>
                <p className="text-sm md:text-base text-[#565656] font-medium leading-relaxed">
                  Ich bin ein Installateur oder Dienstleister, der für den Verkauf und die Konfiguration von Photovoltaikanlagen registriert ist.
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center text-[#e12029] font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2   " />
            </div>
          </button>

          {/* Card C */}
          <button 
               onClick={() => handleSelect('Company')} 
            className="group bg-white text-left p-6 md:p-10 -   hover: flex flex-col justify-between ] border-2 border-transparent hover:border-[#e12029]"
          >
             <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#dfdfdf]  flex items-center justify-center group-hover:bg-[#e12029]  ">
                <Building className="w-6 h-6 md:w-7 md:h-7 text-[#e12029] group-hover:text-white  " />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-[#363636] mb-2 md:mb-3">Unternehmen</h3>
                <p className="text-sm md:text-base text-[#565656] font-medium leading-relaxed">
                  Ich vertrete ein Unternehmen, das nach großflächigen Energiespeicherlösungen und Netzdienstleistungen sucht.
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center text-[#e12029] font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Weiter</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2   " />
            </div>
          </button>
        </div>
      </main>

    </div>
  );
}
