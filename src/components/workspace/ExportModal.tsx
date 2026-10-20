import React, { useState } from 'react';
import { X, Download, ShieldCheck, CheckCircle2, FileCheck } from 'lucide-react';
import { formatBytes } from '../../lib/imageProcessing';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportData: {
    blob: Blob;
    objectUrl: string;
    width: number;
    height: number;
    fileSize: number;
  } | null;
  originalFileName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  exportData,
  originalFileName,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !exportData) return null;

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      const baseName = originalFileName.replace(/\.[^/.]+$/, '');
      link.download = `safeshare-${baseName}-redacted.png`;
      link.href = exportData.objectUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess(true);
    } catch (err) {
      console.error('Download execution error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-[#0A0A0A] border-4 border-[#CCFF00] shadow-brutal-volt-lg p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#141414] border-2 border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00] text-[#FFFFFF]"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#121212] border-2 border-[#CCFF00] flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-[#CCFF00]" />
          </div>
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#FFFFFF] uppercase tracking-wide">
              FINAL COPY PREVIEW
            </h3>
            <p className="font-mono text-xs text-[#888888]">
              Verify your permanent redactions before downloading
            </p>
          </div>
        </div>

        {/* Rendered Preview Image */}
        <div className="relative border-4 border-[#222222] bg-[#000000] p-3 mb-6 flex items-center justify-center max-h-[380px] overflow-hidden">
          <img
            src={exportData.objectUrl}
            alt="Permanently redacted preview"
            className="max-h-[350px] w-auto object-contain mx-auto border border-[#333333]"
          />
        </div>

        {/* Export Metadata & Security Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#121212] border-2 border-[#262626] p-3.5 space-y-1.5 font-mono text-xs">
            <span className="text-[#777777] uppercase block font-bold">PIXEL SPECIFICATIONS</span>
            <div className="flex justify-between text-[#CCCCCC]">
              <span>Dimensions:</span>
              <strong className="text-[#FFFFFF]">{exportData.width} × {exportData.height} px</strong>
            </div>
            <div className="flex justify-between text-[#CCCCCC]">
              <span>File Size:</span>
              <strong className="text-[#CCFF00]">{formatBytes(exportData.fileSize)}</strong>
            </div>
            <div className="flex justify-between text-[#CCCCCC]">
              <span>Format:</span>
              <strong className="text-[#FFFFFF]">PNG (Lossless Canvas)</strong>
            </div>
          </div>

          <div className="bg-[#121212] border-2 border-[#262626] p-3.5 space-y-1.5 font-mono text-xs">
            <span className="text-[#777777] uppercase block font-bold">PRIVACY VERIFICATION</span>
            <div className="flex items-center gap-2 text-[#CCFF00]">
              <ShieldCheck className="w-4 h-4" />
              <span>Canvas Re-encoded</span>
            </div>
            <p className="text-[#AAAAAA] text-[11px] leading-tight">
              Original camera EXIF tags, GPS coords, and raw sensor metadata have been stripped during canvas re-rasterization.
            </p>
          </div>
        </div>

        {/* Success Confirmation or Action Buttons */}
        {downloadSuccess ? (
          <div className="p-4 bg-[#0F220B] border-2 border-[#44BB22] text-[#88EE77] font-mono text-sm flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#44BB22] shrink-0" />
              <div>
                <strong className="block text-[#FFFFFF] uppercase">DOWNLOAD SUCCESSFUL</strong>
                <span>Redacted file saved directly to your local device.</span>
              </div>
            </div>
            <button
              onClick={() => setDownloadSuccess(false)}
              className="text-xs uppercase text-[#88EE77] underline hover:text-[#FFFFFF]"
            >
              DOWNLOAD AGAIN
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t-2 border-[#222222]">
          <button
            type="button"
            onClick={onClose}
            className="btn-brutal bg-[#121212] text-[#FFFFFF] font-mono font-bold text-xs sm:text-sm px-5 py-3 border-2 border-[#333333] hover:border-[#CCFF00]"
          >
            BACK TO WORKSPACE
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="btn-brutal bg-[#CCFF00] text-[#000000] font-mono font-black text-xs sm:text-sm px-6 py-3 border-2 border-[#000000] shadow-brutal-white hover:bg-[#b8e600] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD REDACTED IMAGE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
