import React, { useState, useEffect, useCallback } from 'react';
import { UploadArea } from './UploadArea';
import { RedactionCanvas } from './RedactionCanvas';
import { Toolbar } from './Toolbar';
import { AssistedDetectionPanel } from './AssistedDetectionPanel';
import { ExportModal } from './ExportModal';
import type { RedactionRegion, ToolMode, ImageMetadata } from '../../types';
import { createRedactedExport, formatBytes } from '../../lib/imageProcessing';
import { Download, RefreshCw, Eye, AlertCircle, FileCheck2, HelpCircle } from 'lucide-react';

export const Workspace: React.FC = () => {
  // Document state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [loadedImageElement, setLoadedImageElement] = useState<HTMLImageElement | null>(null);
  const [isSampleDoc, setIsSampleDoc] = useState<boolean>(false);

  // Redaction state
  const [regions, setRegions] = useState<RedactionRegion[]>([]);
  const [currentMode, setCurrentMode] = useState<ToolMode>('blackout');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  // Undo / Redo History stack
  const [history, setHistory] = useState<RedactionRegion[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Export & Modals
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportData, setExportData] = useState<{
    blob: Blob;
    objectUrl: string;
    width: number;
    height: number;
    fileSize: number;
  } | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // Handle image selected from upload area
  const handleImageSelected = (file: File | null, dataUrl: string, metadata: ImageMetadata) => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(dataUrl);
      setImageMetadata(metadata);
      setLoadedImageElement(img);
      setIsSampleDoc(file === null && metadata.name.includes('sample'));
      setRegions([]);
      setHistory([[]]);
      setHistoryIndex(0);
      setSelectedRegionId(null);
    };
    img.src = dataUrl;
  };

  // Push new state to history
  const updateRegionsWithHistory = useCallback((newRegions: RedactionRegion[]) => {
    setRegions(newRegions);
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newRegions];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setRegions(history[newIndex]);
      setSelectedRegionId(null);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setRegions(history[newIndex]);
      setSelectedRegionId(null);
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedRegionId) return;
    const filtered = regions.filter((r) => r.id !== selectedRegionId);
    updateRegionsWithHistory(filtered);
    setSelectedRegionId(null);
  };

  const handleClearAllConfirmed = () => {
    updateRegionsWithHistory([]);
    setSelectedRegionId(null);
    setShowClearConfirm(false);
  };

  const handleResetWorkspace = () => {
    if (regions.length > 0) {
      setShowResetConfirm(true);
    } else {
      executeFullReset();
    }
  };

  const executeFullReset = () => {
    setImageSrc(null);
    setImageMetadata(null);
    setLoadedImageElement(null);
    setRegions([]);
    setHistory([]);
    setHistoryIndex(-1);
    setSelectedRegionId(null);
    setExportData(null);
    setShowResetConfirm(false);
  };

  // Keyboard shortcut listener for Delete, Undo, Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedRegionId) {
          e.preventDefault();
          handleDeleteSelected();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Prepare and generate permanent pixel-level export
  const handleGenerateExport = async () => {
    if (!loadedImageElement || regions.length === 0) return;

    try {
      setIsExporting(true);
      const result = await createRedactedExport(loadedImageElement, regions, 'image/png');
      setExportData(result);
      setShowExportModal(true);
    } catch (err) {
      console.error('Failed to create permanent export:', err);
      alert('Export generation failed. Please check image permissions or dimensions.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section id="workspace" className="py-12 sm:py-16 bg-[#000000] border-b-4 border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Workspace Title & Live Privacy Status Badge */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-block bg-[#121212] border border-[#333333] px-3 py-1 font-mono text-xs text-[#CCFF00] uppercase tracking-wider mb-2">
              // ACTIVE BROWSER SESSION
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-[#FFFFFF] uppercase tracking-wide">
              REDACTION WORKSPACE
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#0F1D0B] border-2 border-[#CCFF00] px-4 py-2 shadow-brutal-volt-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
            <span className="font-mono text-xs font-bold text-[#FFFFFF] tracking-wider uppercase">
              100% LOCAL EXECUTION • ZERO SERVER TRAFFIC
            </span>
          </div>
        </div>

        {/* If no image loaded, show Upload Area */}
        {!imageSrc || !loadedImageElement || !imageMetadata ? (
          <UploadArea onImageSelected={handleImageSelected} />
        ) : (
          /* Active Document Studio */
          <div className="space-y-6">
            
            {/* Document Metadata Bar */}
            <div className="bg-[#0C0C0C] border-4 border-[#222222] p-4 flex flex-wrap items-center justify-between gap-4 shadow-brutal">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#161616] border-2 border-[#333333] flex items-center justify-center">
                  <FileCheck2 className="w-5 h-5 text-[#CCFF00]" />
                </div>
                <div>
                  <h4 className="font-mono text-sm sm:text-base font-bold text-[#FFFFFF] truncate max-w-xs sm:max-w-md">
                    {imageMetadata.name}
                  </h4>
                  <div className="flex items-center gap-3 font-mono text-xs text-[#888888] mt-0.5">
                    <span>{imageMetadata.width} × {imageMetadata.height}px</span>
                    <span>•</span>
                    <span>{formatBytes(imageMetadata.size)}</span>
                    <span>•</span>
                    <span className="uppercase text-[#CCFF00]">{imageMetadata.type.replace('image/', '')}</span>
                  </div>
                </div>
              </div>

              {/* Document actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetWorkspace}
                  className="btn-brutal bg-[#161616] text-[#FFFFFF] font-mono text-xs font-bold px-4 py-2.5 border-2 border-[#333333] hover:border-[#FF5555] hover:text-[#FF5555] flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CHANGE DOCUMENT</span>
                </button>
              </div>
            </div>

            {/* Main Studio Grid: Two-column desktop, stacked mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Canvas Viewport (7 Cols on large screens) */}
              <div className="lg:col-span-8">
                <RedactionCanvas
                  imageSrc={imageSrc}
                  imageElement={loadedImageElement}
                  regions={regions}
                  currentMode={currentMode}
                  selectedRegionId={selectedRegionId}
                  onRegionsChange={updateRegionsWithHistory}
                  onSelectRegion={setSelectedRegionId}
                />
              </div>

              {/* Right Column: Editing Tools, Assisted Detection, and Export (4 Cols) */}
              <div className="lg:col-span-4 space-y-5">
                
                {/* 1. Main Tools & History */}
                <Toolbar
                  currentMode={currentMode}
                  onSelectMode={setCurrentMode}
                  canUndo={historyIndex > 0}
                  canRedo={historyIndex < history.length - 1}
                  onUndo={handleUndo}
                  onRedo={handleRedo}
                  selectedRegionId={selectedRegionId}
                  onDeleteSelected={handleDeleteSelected}
                  onClearAll={() => setShowClearConfirm(true)}
                  regionCount={regions.length}
                />

                {/* 2. Assisted Detection */}
                <AssistedDetectionPanel
                  isSampleDoc={isSampleDoc}
                  onApplySuggestions={(suggested) => {
                    updateRegionsWithHistory([...regions, ...suggested]);
                  }}
                />

                {/* 3. Export Actions Card */}
                <div className="bg-[#0C0C0C] border-4 border-[#222222] p-5 shadow-brutal space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#888888] uppercase tracking-wider font-bold">
                      3. FINALIZE & EXPORT
                    </span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 border ${
                      regions.length > 0 
                        ? 'bg-[#15240B] text-[#CCFF00] border-[#CCFF00]' 
                        : 'bg-[#181818] text-[#666666] border-[#333333]'
                    }`}>
                      {regions.length} {regions.length === 1 ? 'REDACTION' : 'REDACTIONS'}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-[#AAAAAA] leading-relaxed">
                    Permanent export bakes your redactions directly into new output pixels and strips image metadata.
                  </p>

                  <div className="space-y-2.5">
                    {/* Preview Final Copy Button */}
                    <button
                      type="button"
                      onClick={handleGenerateExport}
                      disabled={regions.length === 0 || isExporting}
                      className={`w-full py-3 px-4 font-mono font-bold text-xs sm:text-sm border-2 flex items-center justify-center gap-2 btn-brutal transition-all ${
                        regions.length > 0
                          ? 'bg-[#FFFFFF] text-[#000000] border-[#000000] shadow-brutal-sm hover:bg-[#CCFF00]'
                          : 'bg-[#141414] text-[#444444] border-[#222222] cursor-not-allowed'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isExporting ? 'RASTERIZING PIXELS...' : 'PREVIEW FINAL COPY'}</span>
                    </button>

                    {/* Download Redacted Image Button */}
                    <button
                      type="button"
                      onClick={handleGenerateExport}
                      disabled={regions.length === 0 || isExporting}
                      className={`w-full py-3.5 px-4 font-mono font-black text-sm border-2 flex items-center justify-center gap-2 btn-brutal transition-all ${
                        regions.length > 0
                          ? 'bg-[#CCFF00] text-[#000000] border-[#000000] shadow-brutal-white hover:bg-[#b8e600]'
                          : 'bg-[#121212] text-[#444444] border-[#222222] cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>DOWNLOAD REDACTED IMAGE</span>
                    </button>
                  </div>

                  {regions.length === 0 && (
                    <div className="p-2.5 bg-[#141414] border border-[#222222] font-mono text-[11px] text-[#777777] flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                      <span>Draw at least one redaction box to enable export.</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* Export Review Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        exportData={exportData}
        originalFileName={imageMetadata?.name || 'document'}
      />

      {/* Confirmation Modal: Reset Workspace */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80">
          <div className="bg-[#0E0E0E] border-4 border-[#FF3333] shadow-brutal-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 text-[#FF3333] mb-3">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-mono text-lg font-bold uppercase text-[#FFFFFF]">DISCARD ALL EDITS?</h4>
            </div>
            <p className="font-sans text-sm text-[#CCCCCC] mb-6">
              You have {regions.length} unsaved redaction(s). Discarding will clear the current document and all edits permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 font-mono text-xs font-bold bg-[#1A1A1A] text-[#FFFFFF] border border-[#333333]"
              >
                KEEP EDITING
              </button>
              <button
                type="button"
                onClick={executeFullReset}
                className="px-4 py-2 font-mono text-xs font-bold bg-[#FF3333] text-[#FFFFFF] border-2 border-[#000000] shadow-brutal-sm"
              >
                DISCARD AND RESET
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Clear All Redactions */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80">
          <div className="bg-[#0E0E0E] border-4 border-[#FFAA00] shadow-brutal-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 text-[#FFAA00] mb-3">
              <AlertCircle className="w-6 h-6" />
              <h4 className="font-mono text-lg font-bold uppercase text-[#FFFFFF]">CLEAR ALL REDACTIONS?</h4>
            </div>
            <p className="font-sans text-sm text-[#CCCCCC] mb-6">
              This will remove all {regions.length} redaction boxes from this document. (You can also undo this action afterwards).
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 font-mono text-xs font-bold bg-[#1A1A1A] text-[#FFFFFF] border border-[#333333]"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleClearAllConfirmed}
                className="px-4 py-2 font-mono text-xs font-bold bg-[#FFAA00] text-[#000000] border-2 border-[#000000] shadow-brutal-sm font-black"
              >
                CLEAR ALL
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
