import React from 'react';
import { XCircle, CheckCircle2, AlertOctagon, ShieldCheck } from 'lucide-react';

export const PrivacyComparison: React.FC = () => {
  return (
    <section className="py-20 bg-[#000000] border-b-4 border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[#121212] border border-[#333333] px-3.5 py-1 font-mono text-xs text-[#CCFF00] uppercase tracking-wider mb-3">
            // ARCHITECTURAL PARADIGM
          </div>
          <h2 className="font-display text-4xl sm:text-6xl text-[#FFFFFF] uppercase tracking-wide">
            YOUR PRIVACY IS NOT AN ADD-ON.
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#AAAAAA] mt-3">
            A side-by-side comparison of general online document processing risks versus Safe Share's local execution principles.
          </p>
        </div>

        {/* Two-Column Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Column 1: THE OLD WAY (Dark background) */}
          <div className="bg-[#0E0E0E] border-4 border-[#333333] p-8 sm:p-10 shadow-brutal flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#200A0A] border-2 border-[#FF4444] flex items-center justify-center">
                  <AlertOctagon className="w-5 h-5 text-[#FF4444]" />
                </div>
                <div>
                  <span className="font-mono text-xs text-[#FF6666] tracking-widest uppercase block font-bold">
                    LEGACY RISK PARADIGM
                  </span>
                  <h3 className="font-display text-3xl text-[#FFFFFF] uppercase tracking-wide">
                    THE OLD WAY
                  </h3>
                </div>
              </div>

              <div className="space-y-5 pt-4 border-t-2 border-[#1F1F1F]">
                {[
                  'Documents may be sent to external services.',
                  'Processing methods may be unclear.',
                  'Metadata may remain in downloaded images.',
                  'Visual overlays may leave original information recoverable.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <XCircle className="w-5 h-5 text-[#FF4444] shrink-0 mt-0.5" />
                    <span className="font-sans text-base text-[#CCCCCC] leading-snug font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1C1C1C] font-mono text-xs text-[#666666]">
              * General industry vulnerabilities noted across standard cloud utility web applications.
            </div>
          </div>

          {/* Column 2: THE SAFE SHARE APPROACH (Volt Green Background) */}
          <div className="bg-[#CCFF00] border-4 border-[#000000] p-8 sm:p-10 shadow-brutal-white-lg flex flex-col justify-between text-[#000000]">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#000000] border-2 border-[#000000] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <span className="font-mono text-xs text-[#000000] tracking-widest uppercase block font-black">
                    SAFE SHARE PARADIGM
                  </span>
                  <h3 className="font-display text-3xl text-[#000000] uppercase tracking-wide">
                    THE SAFE SHARE APPROACH
                  </h3>
                </div>
              </div>

              <div className="space-y-5 pt-4 border-t-2 border-[#000000]/20">
                {[
                  'Process supported images locally in the user browser.',
                  'Avoid server uploads of document contents.',
                  'Re-encode supported image exports to strip camera EXIF.',
                  'Apply redactions directly to the exported image pixels.',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-[#000000] shrink-0 mt-0.5" />
                    <span className="font-sans text-base text-[#000000] font-bold leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#000000]/20 font-mono text-xs text-[#111111] font-bold uppercase tracking-wider">
              CLIENT-SIDE VERIFIED • ZERO TELEMETRY UPLOADS
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
