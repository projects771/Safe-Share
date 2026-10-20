import React from 'react';
import { Terminal, Globe, Lock, Cpu, AlertTriangle } from 'lucide-react';

export const PrivacySecurity: React.FC = () => {
  return (
    <section id="privacy" className="py-20 bg-[#0A0A0A] border-b-4 border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-block bg-[#121212] border border-[#333333] px-3.5 py-1 font-mono text-xs text-[#CCFF00] uppercase tracking-wider mb-3">
            // TRUST & INTEGRITY
          </div>
          <h2 className="font-display text-4xl sm:text-6xl text-[#FFFFFF] uppercase tracking-wide">
            PRIVACY & SECURITY
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#AAAAAA] max-w-2xl mt-3 font-medium">
            Safe Share is engineered under strict client-side constraints. We do not store, proxy, transmit, or monetize your documents.
          </p>
        </div>

        {/* 3 Prominent Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-[#111111] border-4 border-[#222222] p-6 shadow-brutal">
            <div className="w-12 h-12 bg-[#1A1A1A] border-2 border-[#CCFF00] flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-wider font-bold block mb-1">
              GUARANTEE 01
            </span>
            <h3 className="font-display text-2xl text-[#FFFFFF] uppercase tracking-wide mb-2">
              LOCAL PROCESSING
            </h3>
            <p className="font-sans text-sm text-[#AAAAAA] leading-relaxed">
              All pixel rasterization, blur convolutions, downsampling, and blackout algorithms execute exclusively in your browser's local V8 JavaScript and HTML5 Canvas engine.
            </p>
          </div>

          <div className="bg-[#111111] border-4 border-[#222222] p-6 shadow-brutal">
            <div className="w-12 h-12 bg-[#1A1A1A] border-2 border-[#CCFF00] flex items-center justify-center mb-5">
              <Globe className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-wider font-bold block mb-1">
              GUARANTEE 02
            </span>
            <h3 className="font-display text-2xl text-[#FFFFFF] uppercase tracking-wide mb-2">
              NO SERVER UPLOADS
            </h3>
            <p className="font-sans text-sm text-[#AAAAAA] leading-relaxed">
              Safe Share operates as a fully static, frontend-only application without a backend API or server-side database. Your sensitive identity files never touch a remote storage bucket.
            </p>
          </div>

          <div className="bg-[#111111] border-4 border-[#222222] p-6 shadow-brutal">
            <div className="w-12 h-12 bg-[#1A1A1A] border-2 border-[#CCFF00] flex items-center justify-center mb-5">
              <Lock className="w-6 h-6 text-[#CCFF00]" />
            </div>
            <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-wider font-bold block mb-1">
              GUARANTEE 03
            </span>
            <h3 className="font-display text-2xl text-[#FFFFFF] uppercase tracking-wide mb-2">
              FILE STAYS IN BROWSER
            </h3>
            <p className="font-sans text-sm text-[#AAAAAA] leading-relaxed">
              When you reset the workspace or close the browser tab, the memory object URLs are revoked. No remote copy exists to delete because none was ever created.
            </p>
          </div>

        </div>

        {/* HOW TO VERIFY SECTION */}
        <div className="bg-[#0C0C0C] border-4 border-[#333333] p-8 sm:p-10 shadow-brutal-lg mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-7 h-7 text-[#CCFF00]" />
            <h3 className="font-display text-3xl text-[#FFFFFF] uppercase tracking-wide">
              HOW TO VERIFY WITH BROWSER DEVTOOLS
            </h3>
          </div>

          <p className="font-sans text-base text-[#CCCCCC] leading-relaxed mb-6 max-w-3xl font-medium">
            Don't trust blind marketing claims. You can independently verify that Safe Share makes 0 outbound requests with your document contents:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-[#141414] border-2 border-[#262626] p-4">
              <span className="text-[#CCFF00] font-bold block mb-1">STEP 1: OPEN DEVTOOLS</span>
              <p className="text-[#AAAAAA]">
                Press <kbd className="bg-[#242424] px-1.5 py-0.5 text-[#FFFFFF] border border-[#444]">F12</kbd> or <kbd className="bg-[#242424] px-1.5 py-0.5 text-[#FFFFFF] border border-[#444]">Ctrl+Shift+I</kbd> in your browser to inspect the runtime environment.
              </p>
            </div>

            <div className="bg-[#141414] border-2 border-[#262626] p-4">
              <span className="text-[#CCFF00] font-bold block mb-1">STEP 2: CHECK NETWORK TAB</span>
              <p className="text-[#AAAAAA]">
                Switch to the <strong>Network</strong> tab and filter by <strong>Fetch/XHR</strong>. Upload any high-res image and draw multiple redactions.
              </p>
            </div>

            <div className="bg-[#141414] border-2 border-[#262626] p-4">
              <span className="text-[#CCFF00] font-bold block mb-1">STEP 3: OBSERVE 0 PAYLOADS</span>
              <p className="text-[#AAAAAA]">
                Notice that zero POST/PUT requests are triggered. The export is created purely via local Canvas <code className="text-[#FFFFFF]">toBlob()</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Honest Limitations & Security Disclosures */}
        <div className="bg-[#141414] border-2 border-[#333333] p-6 text-xs font-mono text-[#AAAAAA] space-y-3">
          <div className="flex items-center gap-2 text-[#FFAA00] font-bold uppercase text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Honest Limits of Client-Side Security</span>
          </div>
          <ul className="list-disc pl-5 space-y-1.5 text-[#CCCCCC]">
            <li>
              <strong>Memory Footprint:</strong> While Safe Share revokes Object URLs upon file change, browser garbage collection determines exact physical memory clearing timing.
            </li>
            <li>
              <strong>Blur vs Blackout:</strong> Mathematical blur and pixelation distort spatial frequencies, but under specialized AI reconstruction attacks, heavy blackouts remain the only 100% cryptographic redaction method.
            </li>
            <li>
              <strong>Metadata:</strong> Re-rasterizing via HTML5 Canvas strips standard photographic EXIF/IPTC tags (camera model, GPS coordinates, shutter details) in modern browsers.
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
};
