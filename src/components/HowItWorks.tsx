import React from 'react';
import { Upload, Search, ShieldX, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: 'STEP 01',
      title: 'UPLOAD',
      desc: 'Choose an image from your device. Supported formats: JPG, JPEG, PNG.',
      icon: <Upload className="w-6 h-6 text-[#000000]" />,
      badge: 'CLIENT-ONLY',
    },
    {
      num: 'STEP 02',
      title: 'REVIEW',
      desc: 'Identify the information you want to hide using manual tools or supported detection.',
      icon: <Search className="w-6 h-6 text-[#000000]" />,
      badge: 'ZOOM & FIT',
    },
    {
      num: 'STEP 03',
      title: 'REDACT',
      desc: 'Apply redactions directly to the image pixels using blackout, pixelation, or blur.',
      icon: <ShieldX className="w-6 h-6 text-[#000000]" />,
      badge: 'PIXEL BAKE',
    },
    {
      num: 'STEP 04',
      title: 'DOWNLOAD',
      desc: 'Export the processed copy and review it before sharing. EXIF metadata stripped.',
      icon: <DownloadCloud className="w-6 h-6 text-[#000000]" />,
      badge: 'READY TO SHARE',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#070707] border-b-4 border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-14">
          <div className="inline-block bg-[#121212] border border-[#333333] px-3.5 py-1 font-mono text-xs text-[#CCFF00] uppercase tracking-wider mb-3">
            // SIMPLE WORKFLOW
          </div>
          <h2 className="font-display text-4xl sm:text-6xl text-[#FFFFFF] uppercase tracking-wide">
            HOW IT WORKS
          </h2>
          <p className="font-sans text-base sm:text-lg text-[#AAAAAA] max-w-2xl mt-3 font-medium">
            Four simple steps to safely redact personal identifiable information with guaranteed client-side isolation.
          </p>
        </div>

        {/* 4 Responsive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="bg-[#0E0E0E] border-4 border-[#222222] hover:border-[#CCFF00] p-6 shadow-brutal flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Header: Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-black bg-[#CCFF00] text-[#000000] px-3 py-1 border border-[#000000] shadow-sm tracking-widest">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 bg-[#CCFF00] border-2 border-[#000000] flex items-center justify-center shadow-brutal-sm group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="font-display text-3xl text-[#FFFFFF] uppercase tracking-wide mb-3 group-hover:text-[#CCFF00] transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-sm text-[#CCCCCC] leading-relaxed mb-6">
                  "{step.desc}"
                </p>
              </div>

              {/* Step Footer Badge */}
              <div className="pt-4 border-t border-[#1F1F1F] flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#777777] uppercase tracking-wider">
                  {step.badge}
                </span>
                <span className="font-numeric text-xs font-bold text-[#CCFF00]">
                  0{idx + 1} / 04
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
