import React, { useState } from 'react';
import { Sparkles, Check, ShieldAlert, Cpu } from 'lucide-react';
import type { RedactionRegion } from '../../types';

interface AssistedDetectionPanelProps {
  isSampleDoc: boolean;
  onApplySuggestions: (regions: RedactionRegion[]) => void;
}

interface PatternRule {
  id: string;
  label: string;
  pattern: string;
  enabled: boolean;
}

export const AssistedDetectionPanel: React.FC<AssistedDetectionPanelProps> = ({
  isSampleDoc,
  onApplySuggestions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rules, setRules] = useState<PatternRule[]>([
    { id: 'aadhaar', label: 'Aadhaar ID (12-digit UID)', pattern: '\\d{4}\\s?\\d{4}\\s?\\d{4}', enabled: true },
    { id: 'pan', label: 'PAN Number (10-char Alphanumeric)', pattern: '[A-Z]{5}[0-9]{4}[A-Z]{1}', enabled: true },
    { id: 'phone', label: 'Phone Numbers & Mobile', pattern: '\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}', enabled: true },
    { id: 'email', label: 'Email Addresses', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', enabled: true },
    { id: 'dob', label: 'Dates of Birth (DOB)', pattern: '\\d{2}[-/.]\\d{2}[-/.]\\d{4}', enabled: true },
    { id: 'bank', label: 'Bank Account / IFSC', pattern: '[A-Z]{4}0[A-Z0-9]{6}', enabled: false },
  ]);

  const [appliedSample, setAppliedSample] = useState(false);

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Pre-calculated ground-truth coordinates for our generated sample card
  const handleApplySampleDetections = () => {
    const sampleRegions: RedactionRegion[] = [
      { id: 'sample-dob', type: 'blackout', x: 375, y: 315, width: 260, height: 42, label: 'DOB' },
      { id: 'sample-pan', type: 'blackout', x: 375, y: 385, width: 230, height: 42, label: 'PAN' },
      { id: 'sample-aadhaar', type: 'blackout', x: 375, y: 455, width: 300, height: 42, label: 'AADHAAR' },
      { id: 'sample-phone', type: 'blackout', x: 375, y: 525, width: 270, height: 42, label: 'PHONE' },
      { id: 'sample-email', type: 'blackout', x: 375, y: 595, width: 440, height: 42, label: 'EMAIL' },
    ];
    onApplySuggestions(sampleRegions);
    setAppliedSample(true);
  };

  return (
    <div className="bg-[#0A0A0A] border-4 border-[#222222] p-4 sm:p-5 shadow-brutal">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#CCFF00]" />
          <div>
            <h4 className="font-mono text-xs sm:text-sm font-bold text-[#FFFFFF] tracking-wider uppercase">
              ASSISTED DETECTION (EXPERIMENTAL)
            </h4>
            <p className="font-mono text-[11px] text-[#777777]">
              Regex rule presets & sample document detectors
            </p>
          </div>
        </div>
        <button
          type="button"
          className="font-mono text-xs font-bold text-[#CCFF00] px-2.5 py-1 border border-[#333333] hover:border-[#CCFF00]"
        >
          {isOpen ? 'COLLAPSE' : 'EXPAND'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t-2 border-[#1E1E1E] space-y-4">
          
          {/* Honest Technical Status Notice */}
          <div className="bg-[#141414] border border-[#2E2E2E] p-3 text-xs font-mono text-[#AAAAAA] flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="text-[#FFFFFF] block mb-0.5">HONEST PRIVACY DISCLOSURE:</strong>
              Client-side Tesseract WASM is currently disabled by default to avoid downloading 30MB+ weights over user mobile connections. Manual drawing tools remain 100% active and instantaneous.
            </div>
          </div>

          {/* If the fictional sample doc is loaded, allow 1-click apply of true verified regions */}
          {isSampleDoc && (
            <div className="bg-[#121B0E] border-2 border-[#CCFF00] p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-[#CCFF00] font-mono text-xs font-bold uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>Verified Sample Doc Coordinates Detected</span>
              </div>
              <p className="font-mono text-[11px] text-[#DDDDDD]">
                Fictional demo card detected with 5 target PII fields (DOB, PAN, Aadhaar, Phone, Email).
              </p>
              <button
                type="button"
                onClick={handleApplySampleDetections}
                disabled={appliedSample}
                className={`btn-brutal px-4 py-2 font-mono text-xs font-black uppercase border-2 flex items-center gap-2 ${
                  appliedSample
                    ? 'bg-[#181818] text-[#777777] border-[#333333] cursor-default'
                    : 'bg-[#CCFF00] text-[#000000] border-[#000000] hover:bg-[#b8e600]'
                }`}
              >
                {appliedSample ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{appliedSample ? 'SUGGESTIONS APPLIED' : 'APPLY SAMPLE REDACTION PRESETS'}</span>
              </button>
            </div>
          )}

          {/* Regex Pattern Toggles */}
          <div>
            <label className="font-mono text-xs text-[#777777] uppercase block mb-2 font-bold">
              TARGET SENSITIVE PATTERNS:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2.5 border text-left cursor-pointer transition-colors flex items-center justify-between ${
                    rule.enabled
                      ? 'bg-[#121212] border-[#CCFF00] text-[#FFFFFF]'
                      : 'bg-[#0E0E0E] border-[#222222] text-[#666666]'
                  }`}
                >
                  <div className="overflow-hidden pr-2">
                    <p className="font-mono text-xs font-bold truncate">{rule.label}</p>
                    <p className="font-mono text-[10px] text-[#555555] truncate">{rule.pattern}</p>
                  </div>
                  <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${
                    rule.enabled ? 'bg-[#CCFF00] border-[#000000]' : 'border-[#444444]'
                  }`}>
                    {rule.enabled && <Check className="w-3 h-3 text-[#000000]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
