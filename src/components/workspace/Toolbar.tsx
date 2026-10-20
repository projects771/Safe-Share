import React from 'react';
import type { ToolMode, RedactionType } from '../../types';
import { Square, Grid, Wand2, MousePointer, Undo2, Redo2, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

interface ToolbarProps {
  currentMode: ToolMode;
  onSelectMode: (mode: ToolMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  selectedRegionId: string | null;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  regionCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentMode,
  onSelectMode,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  selectedRegionId,
  onDeleteSelected,
  onClearAll,
  regionCount,
}) => {
  const tools: { id: ToolMode; label: string; icon: React.ReactNode; desc: string; isType?: RedactionType }[] = [
    {
      id: 'blackout',
      label: 'BLACKOUT',
      icon: <Square className="w-5 h-5 fill-current" />,
      desc: '100% opaque black. Recommended for maximum privacy.',
      isType: 'blackout',
    },
    {
      id: 'pixelate',
      label: 'PIXELATE',
      icon: <Grid className="w-5 h-5" />,
      desc: 'Downsamples pixels into discrete mosaic blocks.',
      isType: 'pixelate',
    },
    {
      id: 'blur',
      label: 'BLUR',
      icon: <Wand2 className="w-5 h-5" />,
      desc: 'Multi-pass mathematical Gaussian blur.',
      isType: 'blur',
    },
    {
      id: 'select',
      label: 'SELECT / MOVE',
      icon: <MousePointer className="w-5 h-5" />,
      desc: 'Click regions to resize, move, or delete.',
    },
  ];

  return (
    <div className="bg-[#0C0C0C] border-4 border-[#222222] p-4 sm:p-5 shadow-brutal space-y-5">
      
      {/* Tool Selector Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-mono text-xs text-[#888888] uppercase tracking-wider font-bold">
            1. CHOOSE REDACTION MODE
          </label>
          <span className="font-mono text-xs bg-[#1E1E1E] text-[#CCFF00] px-2 py-0.5 border border-[#333333]">
            ACTIVE: {currentMode.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {tools.map((t) => {
            const isActive = currentMode === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectMode(t.id)}
                className={`p-3 border-2 text-left transition-all btn-brutal ${
                  isActive
                    ? 'bg-[#CCFF00] text-[#000000] border-[#000000] shadow-brutal-white font-black'
                    : 'bg-[#141414] text-[#E0E0E0] border-[#2A2A2A] hover:border-[#CCFF00] hover:text-[#FFFFFF]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {t.icon}
                  <span className="font-mono text-xs sm:text-sm tracking-wider uppercase font-bold">
                    {t.label}
                  </span>
                </div>
                <p className={`font-sans text-[11px] leading-tight line-clamp-2 ${isActive ? 'text-[#000000]' : 'text-[#777777]'}`}>
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* History & Edit Controls */}
      <div className="pt-4 border-t-2 border-[#1E1E1E]">
        <label className="font-mono text-xs text-[#888888] uppercase tracking-wider font-bold block mb-3">
          2. EDITING ACTIONS
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {/* Undo */}
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex-1 py-2 px-3 border-2 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              canUndo
                ? 'bg-[#181818] text-[#FFFFFF] border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00]'
                : 'bg-[#101010] text-[#444444] border-[#1C1C1C] cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>UNDO</span>
          </button>

          {/* Redo */}
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex-1 py-2 px-3 border-2 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              canRedo
                ? 'bg-[#181818] text-[#FFFFFF] border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00]'
                : 'bg-[#101010] text-[#444444] border-[#1C1C1C] cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" />
            <span>REDO</span>
          </button>

          {/* Delete Selected Region */}
          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={!selectedRegionId}
            className={`py-2 px-3 border-2 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              selectedRegionId
                ? 'bg-[#2A0E0E] text-[#FF5555] border-[#FF3333] hover:bg-[#FF3333] hover:text-[#FFFFFF]'
                : 'bg-[#101010] text-[#444444] border-[#1C1C1C] cursor-not-allowed'
            }`}
            title="Delete currently selected region"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">DELETE</span>
          </button>

          {/* Clear All */}
          <button
            type="button"
            onClick={onClearAll}
            disabled={regionCount === 0}
            className={`py-2 px-3 border-2 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
              regionCount > 0
                ? 'bg-[#181818] text-[#FFAA00] border-[#333333] hover:border-[#FFAA00]'
                : 'bg-[#101010] text-[#444444] border-[#1C1C1C] cursor-not-allowed'
            }`}
            title="Clear all redactions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CLEAR ALL</span>
          </button>
        </div>
      </div>

      {/* Privacy Notice Box */}
      <div className="p-3 bg-[#121212] border border-[#282828] text-xs font-mono text-[#888888] flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-[#CCFF00]">PRO-TIP:</strong> For high-stakes PII (Aadhaar, Social Security, Bank PIN), always use <strong className="text-[#FFFFFF]">BLACKOUT</strong> to ensure total cryptographic irrecoverability.
        </p>
      </div>

    </div>
  );
};
