'use client';

import { useRouter } from 'next/navigation';
import { useCalculatorStore } from '@/store/calculatorStore';
import { Persona } from '@/types/calculator';
import { User, Sun, Building, ArrowRight, BatteryMedium } from 'lucide-react';
import { motion } from 'framer-motion';

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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bg-[#f0fdf4] min-h-screen flex flex-col items-center font-inter text-[#0f172a] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[55vh] lg:h-[60vh] bg-[#10b981] rounded-b-[3rem] sm:rounded-b-[8rem] z-0 shadow-lg"></div>

      <main className="flex-grow flex flex-col items-center justify-center w-full px-6 pb-20 pt-8 md:pt-12 z-10 max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 md:mb-8"
        >
          <BatteryMedium className="w-7 h-7 md:w-8 md:h-8 text-[#10b981]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full text-center mb-10 md:mb-16"
        >
          <h1 className="text-[3rem] md:text-[4.5rem] font-bold leading-tight tracking-tight text-white mb-6 drop-shadow-md">
            Who are you?
          </h1>
          <p className="text-[0.95rem] md:text-[1.15rem] font-medium text-white max-w-2xl mx-auto bg-white/20 backdrop-blur-md py-3 px-6 rounded-full border border-white/30 shadow-sm inline-block">
            Select your profile below to tailor your energy storage experience.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full"
        >
          {/* Card A */}
          <motion.button 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('Private')} 
            className="group bg-white text-left p-6 md:p-10 transition-shadow duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between rounded-[2rem] border-2 border-transparent hover:border-[#10b981]"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#dcfce7] rounded-full flex items-center justify-center group-hover:bg-[#10b981] transition-colors duration-300">
                <User className="w-6 h-6 md:w-7 md:h-7 text-[#10b981] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 mb-2 md:mb-3">Private Individual</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                  I am a homeowner looking to optimize my energy usage and reduce my electricity bill.
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center text-[#10b981] font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </motion.button>

          {/* Card B */}
          <motion.button 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('Installer')} 
            className="group bg-white text-left p-6 md:p-10 transition-shadow duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between rounded-[2rem] border-2 border-transparent hover:border-[#10b981]"
          >
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#dcfce7] rounded-full flex items-center justify-center group-hover:bg-[#10b981] transition-colors duration-300">
                <Sun className="w-6 h-6 md:w-7 md:h-7 text-[#10b981] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 mb-2 md:mb-3">Solar Installer</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                  I am an installer or contractor registered to sell and configure photovoltaic systems.
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center text-[#10b981] font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </motion.button>

          {/* Card C */}
          <motion.button 
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSelect('Company')} 
            className="group bg-white text-left p-6 md:p-10 transition-shadow duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between rounded-[2rem] border-2 border-transparent hover:border-[#10b981]"
          >
             <div className="flex flex-col gap-4 md:gap-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#dcfce7] rounded-full flex items-center justify-center group-hover:bg-[#10b981] transition-colors duration-300">
                <Building className="w-6 h-6 md:w-7 md:h-7 text-[#10b981] group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 mb-2 md:mb-3">Business</h3>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
                  I represent a company seeking large-scale energy storage solutions and grid services.
                </p>
              </div>
            </div>
            <div className="mt-6 md:mt-8 flex items-center text-[#10b981] font-bold uppercase tracking-widest text-xs md:text-sm">
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </motion.button>
        </motion.div>
      </main>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="z-10 flex flex-col md:flex-row justify-between items-center w-full max-w-6xl mx-auto py-8 px-8 mt-auto"
      >
        <div className="text-[0.75rem] font-bold uppercase tracking-widest text-[#10b981] opacity-70">
            © 2026 Ngen Solutions
        </div>
        <nav className="flex gap-12 mt-4 md:mt-0">
          <a href="#" className="text-[0.75rem] font-bold uppercase tracking-widest text-[#10b981] opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              Visit our homepage
          </a>
        </nav>
      </motion.footer>
    </div>
  );
}
