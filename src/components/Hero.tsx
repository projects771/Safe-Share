import React from 'react';
import { ArrowRight, Lock, EyeOff, Cpu, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onStartRedacting: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartRedacting }) => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWorkspace = () => {
    onStartRedacting();
    const el = document.getElementById('workspace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative curtain-texture-hero border-b-4 border-[#222222] overflow-hidden py-16 sm:py-24">
      {/* Subtle background vertical lines accent */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-between max-w-7xl mx-auto px-4">
        <div className="w-[1px] h-full bg-[#333333]"></div>
        <div className="w-[1px] h-full bg-[#333333] hidden sm:block"></div>
        <div className="w-[1px] h-full bg-[#333333] hidden lg:block"></div>
        <div className="w-[1px] h-full bg-[#333333]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top technical tag and sticker */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="inline-flex items-center gap-2 bg-[#121212] border-2 border-[#333333] px-3.5 py-1.5 font-mono text-xs sm:text-sm text-[#CCFF00] tracking-widest uppercase">
            <Lock className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>// PRIVACY-FIRST DOCUMENT TOOL</span>
          </div>

          {/* Volt Green Rotated Sticker */}
          <div className="inline-block transform rotate-2 sm:rotate-3 shadow-brutal-sm">
            <span className="bg-[#CCFF00] text-[#000000] font-mono font-black text-xs sm:text-sm tracking-wider uppercase px-4 py-1.5 border-2 border-[#000000] block">
              ★ YOUR DATA STAYS YOURS ★
            </span>
          </div>
        </div>

        {/* Main Headline with Ranchers typography */}
        <div className="max-w-4xl">
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-wide leading-[1.05] text-[#FFFFFF] uppercase mb-6 drop-shadow-md">
            SHARE FILES. <br className="hidden sm:inline" />
            <span className="text-[#CCFF00] underline decoration-4 underline-offset-8">NOT SECRETS.</span>
          </h1>

          <p className="font-sans text-lg sm:text-2xl text-[#CCCCCC] leading-relaxed max-w-2xl mb-10 font-medium">
            Remove sensitive information from identity documents, images, and forms before sharing them.
            Review your redactions and prepare a safer copy <span className="text-[#FFFFFF] font-bold">directly in your browser</span>.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-14">
            <button
              onClick={scrollToWorkspace}
              className="btn-brutal bg-[#CCFF00] text-[#000000] font-mono font-black text-base sm:text-lg px-8 py-4 border-4 border-[#000000] shadow-brutal-white-lg hover:bg-[#b8e600] flex items-center gap-3 cursor-pointer"
            >
              <span>START REDACTING</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={scrollToHowItWorks}
              className="btn-brutal bg-[#121212] text-[#FFFFFF] font-mono font-bold text-base sm:text-lg px-7 py-4 border-4 border-[#333333] shadow-brutal hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors cursor-pointer"
            >
              HOW IT WORKS
            </button>
          </div>

          {/* 3 Technical Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t-2 border-[#222222]">
            <div className="bg-[#0D0D0D] border-2 border-[#262626] p-3.5 flex items-center gap-3">
              <Cpu className="w-5 h-5 text-[#CCFF00] shrink-0" />
              <div>
                <p className="font-mono text-xs text-[#777777] uppercase leading-none">SECURITY ARCHITECTURE</p>
                <p className="font-mono text-sm font-bold text-[#FFFFFF] mt-1 tracking-wider">NO SERVER UPLOADS</p>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border-2 border-[#262626] p-3.5 flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-[#CCFF00] shrink-0" />
              <div>
                <p className="font-mono text-xs text-[#777777] uppercase leading-none">PIXEL PRECISION</p>
                <p className="font-mono text-sm font-bold text-[#FFFFFF] mt-1 tracking-wider">MANUAL REDACTION</p>
              </div>
            </div>

            <div className="bg-[#0D0D0D] border-2 border-[#262626] p-3.5 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#CCFF00] shrink-0" />
              <div>
                <p className="font-mono text-xs text-[#777777] uppercase leading-none">LOCAL ENCLAVE</p>
                <p className="font-mono text-sm font-bold text-[#FFFFFF] mt-1 tracking-wider">PRIVACY-FIRST DESIGN</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
