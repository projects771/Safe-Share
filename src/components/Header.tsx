import React, { useState } from 'react';
import { ShieldAlert, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  onStartRedacting: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStartRedacting }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#000000] border-b-4 border-[#222222] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
          >
            <div className="w-12 h-12 bg-[#121212] border-2 border-[#CCFF00] flex items-center justify-center shadow-brutal-volt-sm group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-7 h-7 text-[#CCFF00]" />
            </div>
            <div>
              <span className="font-display text-2xl sm:text-3xl tracking-wider text-[#FFFFFF] group-hover:text-[#CCFF00] transition-colors block leading-none">
                SAFE SHARE
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#777777] uppercase block mt-1">
                // CLIENT-SIDE PRIVACY
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { label: 'HOME', id: 'home' },
              { label: 'WORKSPACE', id: 'workspace' },
              { label: 'HOW IT WORKS', id: 'how-it-works' },
              { label: 'PRIVACY', id: 'privacy' },
              { label: 'CREATORS', id: 'creators' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="font-mono text-sm tracking-wider text-[#E0E0E0] hover:text-[#CCFF00] hover:bg-[#121212] px-3.5 py-2 transition-colors border border-transparent hover:border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => {
                onStartRedacting();
                scrollToSection('workspace');
              }}
              className="btn-brutal bg-[#CCFF00] text-[#000000] font-mono font-bold text-sm px-5 py-2.5 border-2 border-[#000000] shadow-brutal-white hover:bg-[#b8e600] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF]"
            >
              <span>START REDACTING</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-[#333333] bg-[#121212] text-[#FFFFFF] hover:text-[#CCFF00] hover:border-[#CCFF00] focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b-4 border-[#CCFF00] px-4 pt-3 pb-6 space-y-2">
          {[
            { label: 'HOME', id: 'home' },
            { label: 'WORKSPACE', id: 'workspace' },
            { label: 'HOW IT WORKS', id: 'how-it-works' },
            { label: 'PRIVACY & SECURITY', id: 'privacy' },
            { label: 'ABOUT THE CREATORS', id: 'creators' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block w-full text-left font-mono text-base font-bold text-[#FFFFFF] hover:text-[#000000] hover:bg-[#CCFF00] p-3 border border-[#222222] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onStartRedacting();
              scrollToSection('workspace');
            }}
            className="w-full text-center mt-3 bg-[#CCFF00] text-[#000000] font-mono font-bold text-base py-3 border-2 border-[#000000] shadow-brutal-white block"
          >
            START REDACTING NOW
          </button>
        </div>
      )}
    </header>
  );
};
