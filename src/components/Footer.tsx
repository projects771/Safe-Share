import React from 'react';
import { ShieldAlert, ArrowUpRight, Lock } from 'lucide-react';

const CURRENT_YEAR = 2026;

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] border-t-4 border-[#222222] py-16 text-[#E0E0E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b-2 border-[#1C1C1C]">
          
          {/* Brand Info (6 Cols) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#121212] border-2 border-[#CCFF00] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-[#CCFF00]" />
              </div>
              <span className="font-display text-3xl tracking-wider text-[#FFFFFF]">
                SAFE SHARE
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm font-bold text-[#CCFF00] tracking-widest uppercase">
              YOUR DOCUMENTS. YOUR DEVICE. YOUR CONTROL.
            </p>

            <p className="font-sans text-sm text-[#888888] max-w-md leading-relaxed">
              Protect your privacy before you share. Redact sensitive information directly in your browser and download a safer copy of your document.
            </p>

            <div className="inline-flex items-center gap-2 bg-[#101010] border border-[#2A2A2A] px-3 py-1 font-mono text-xs text-[#AAAAAA]">
              <Lock className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-[#CCFF00] font-bold">CLIENT-SIDE APPLICATION</span>
              <span>• Zero Cloud Telemetry</span>
            </div>
          </div>

          {/* Quick Navigation (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">
              QUICK NAVIGATION
            </h4>
            <ul className="space-y-2 font-mono text-xs text-[#888888]">
              {[
                { label: 'HOME', id: 'home' },
                { label: 'WORKSPACE', id: 'workspace' },
                { label: 'HOW IT WORKS', id: 'how-it-works' },
                { label: 'PRIVACY & SECURITY', id: 'privacy' },
                { label: 'ABOUT THE CREATORS', id: 'creators' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="hover:text-[#CCFF00] transition-colors flex items-center gap-1 focus:outline-none"
                  >
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Verification (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold text-[#FFFFFF] uppercase tracking-wider mb-2">
              SECURITY PROTOCOLS
            </h4>
            <div className="space-y-2 font-mono text-xs text-[#888888]">
              <button
                onClick={() => scrollTo('privacy')}
                className="text-left hover:text-[#CCFF00] transition-colors flex items-center gap-1.5"
              >
                <span>Privacy Architecture Spec</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#CCFF00]" />
              </button>
              <button
                onClick={() => scrollTo('privacy')}
                className="text-left hover:text-[#CCFF00] transition-colors flex items-center gap-1.5"
              >
                <span>DevTools Network Audit Guide</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#CCFF00]" />
              </button>
              <p className="text-[11px] text-[#555555] pt-2">
                Re-rasterizes all canvas exports locally. Removes standard camera EXIF data.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#666666]">
          <p>© {CURRENT_YEAR} SAFE SHARE. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[#CCFF00]">BUILT WITH STRICT PRIVACY PRINCIPLES</span>
            <span>NO COOKIES • NO ADS • NO TRACKING</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
