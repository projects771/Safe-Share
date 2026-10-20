import React from 'react';
import { Mail, Code2 } from 'lucide-react';

export const Creators: React.FC = () => {
  const creators = [
    {
      name: 'Nawal Kishore S Pai',
      email: 'nawalkishoresatishpai@gmail.com',
      role: 'Creator / Developer',
    },
    {
      name: 'Gokul B',
      email: 'gokulb7776@gmail.com',
      role: 'Creator / Developer',
    },
  ];

  return (
    <section id="creators" className="relative curtain-texture-creators py-24 border-b-4 border-[#222222] overflow-hidden">
      
      {/* Background Subtle Accent Dividers */}
      <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-between max-w-7xl mx-auto px-4">
        <div className="w-[1px] h-full bg-[#333333]"></div>
        <div className="w-[1px] h-full bg-[#333333]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Centered Uppercase BUILT BY Label */}
        <div className="inline-block bg-[#121212] border-2 border-[#333333] px-4 py-1 font-mono text-xs text-[#CCFF00] uppercase tracking-widest font-bold mb-4">
          BUILT BY
        </div>

        {/* Large Heading: Meet the creators. */}
        <h2 className="font-display text-4xl sm:text-6xl text-[#FFFFFF] tracking-wide mb-14 drop-shadow-md">
          Meet the creators.
        </h2>

        {/* Two Horizontal Cards on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
          {creators.map((creator) => (
            <div
              key={creator.email}
              className="bg-[#0C0C0C]/90 border-2 border-[#262626] hover:border-[#CCFF00] p-6 sm:p-8 shadow-brutal transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Code Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#161616] border border-[#333333] group-hover:border-[#CCFF00] flex items-center justify-center transition-colors">
                    <Code2 className="w-6 h-6 text-[#CCFF00]" />
                  </div>
                  <span className="font-mono text-[11px] text-[#777777] uppercase tracking-wider bg-[#141414] px-2.5 py-1 border border-[#222222]">
                    CORE TEAM
                  </span>
                </div>

                {/* Creator Name */}
                <h3 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] group-hover:text-[#CCFF00] transition-colors mb-2 tracking-tight">
                  {creator.name}
                </h3>

                {/* Role Description */}
                <p className="font-mono text-xs sm:text-sm text-[#777777] uppercase tracking-wider mb-6 font-semibold">
                  {creator.role}
                </p>
              </div>

              {/* Email with Circular Icon and Working mailto Link */}
              <div className="pt-5 border-t border-[#1C1C1C]">
                <a
                  href={`mailto:${creator.email}`}
                  className="flex items-center gap-3 text-[#AAAAAA] hover:text-[#FFFFFF] transition-colors group/link overflow-hidden"
                  title={`Send email to ${creator.name}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#141414] border border-[#333333] group-hover/link:border-[#CCFF00] group-hover/link:bg-[#CCFF00] flex items-center justify-center shrink-0 transition-colors">
                    <Mail className="w-4 h-4 text-[#CCCCCC] group-hover/link:text-[#000000] transition-colors" />
                  </div>
                  <span className="font-mono text-xs sm:text-sm text-[#888888] group-hover/link:text-[#FFFFFF] truncate transition-colors">
                    {creator.email}
                  </span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
