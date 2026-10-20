import React, { useRef, useState } from 'react';
import { UploadCloud, FileImage, Camera, Sparkles, AlertCircle, Shield } from 'lucide-react';
import { generateFictionalSampleDoc } from '../../lib/sampleDocuments';
import type { ImageMetadata } from '../../types';

interface UploadAreaProps {
  onImageSelected: (file: File | null, dataUrl: string, metadata: ImageMetadata) => void;
}

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validation 1: Supported types (explicitly only JPG, JPEG, PNG)
    if (!SUPPORTED_TYPES.includes(file.type.toLowerCase())) {
      setErrorMessage(`Unsupported format "${file.type || 'unknown'}". Safe Share supports JPG, JPEG, and PNG images only.`);
      return;
    }

    // Validation 2: File size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File exceeds the 15 MB safety limit (file is ${(file.size / (1024 * 1024)).toFixed(1)} MB). Please select a smaller image.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const metadata: ImageMetadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        };
        onImageSelected(file, result, metadata);
      };
      img.onerror = () => {
        setErrorMessage('Failed to decode the image file. The file may be corrupt.');
      };
      img.src = result;
    };
    reader.onerror = () => {
      setErrorMessage('Could not read the file from your local disk.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const loadSampleDocument = () => {
    setErrorMessage(null);
    const dataUrl = generateFictionalSampleDoc();
    const img = new Image();
    img.onload = () => {
      const metadata: ImageMetadata = {
        name: 'sample-citizen-card-fictional.png',
        size: Math.round(dataUrl.length * 0.75), // approximate byte size
        type: 'image/png',
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      };
      onImageSelected(null, dataUrl, metadata);
    };
    img.src = dataUrl;
  };

  return (
    <div className="w-full">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
        id="document-upload-input"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
        id="camera-capture-input"
      />

      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-4 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#CCFF00] bg-[#121212] scale-[1.01]'
            : 'border-[#333333] hover:border-[#CCFF00] bg-[#0A0A0A]'
        } shadow-brutal-lg`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="max-w-md mx-auto">
          {/* Icon Badge */}
          <div className="w-20 h-20 bg-[#121212] border-4 border-[#333333] mx-auto mb-6 flex items-center justify-center shadow-brutal group-hover:border-[#CCFF00]">
            <UploadCloud className="w-10 h-10 text-[#CCFF00]" />
          </div>

          <h3 className="font-display text-3xl sm:text-4xl text-[#FFFFFF] uppercase tracking-wide mb-2">
            DROP DOCUMENT HERE
          </h3>

          <p className="font-mono text-sm text-[#AAAAAA] mb-6">
            Drag & drop your image or click to browse local files.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-brutal bg-[#FFFFFF] text-[#000000] font-mono font-bold text-xs sm:text-sm px-5 py-2.5 border-2 border-[#000000] shadow-brutal-sm hover:bg-[#CCFF00] flex items-center gap-2"
            >
              <FileImage className="w-4 h-4" />
              <span>CHOOSE FILE</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="btn-brutal bg-[#121212] text-[#FFFFFF] font-mono font-bold text-xs sm:text-sm px-5 py-2.5 border-2 border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00] flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>USE CAMERA</span>
            </button>

            <button
              type="button"
              onClick={loadSampleDocument}
              className="btn-brutal bg-[#1A1A1A] text-[#CCFF00] font-mono font-bold text-xs sm:text-sm px-5 py-2.5 border-2 border-[#CCFF00] shadow-brutal-volt-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>TRY SAMPLE DOC</span>
            </button>
          </div>

          {/* Technical Requirements / Limits */}
          <div className="bg-[#121212] border border-[#262626] p-3 text-left font-mono text-xs text-[#777777] flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#CCCCCC] font-bold">CLIENT-SIDE PRIVACY GUARANTEE:</p>
              <p>Supported: JPG, JPEG, PNG • Maximum size: 15 MB. No PDF uploads or server roundtrips.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message banner */}
      {errorMessage && (
        <div className="mt-4 p-4 bg-[#200505] border-2 border-[#FF3333] text-[#FFAAAA] font-mono text-sm flex items-start gap-3 shadow-brutal">
          <AlertCircle className="w-5 h-5 text-[#FF3333] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-[#FF5555] block uppercase">Upload Rejected:</span>
            {errorMessage}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs uppercase text-[#FFAAAA] underline hover:text-[#FFFFFF]"
          >
            DISMISS
          </button>
        </div>
      )}
    </div>
  );
};
