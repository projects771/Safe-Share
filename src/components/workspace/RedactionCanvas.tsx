import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { RedactionRegion, ToolMode, HandleType } from '../../types';
import { applyPermanentRedactions } from '../../lib/imageProcessing';
import { ZoomIn, ZoomOut, Maximize2, Eye, EyeOff } from 'lucide-react';

interface RedactionCanvasProps {
  imageSrc: string;
  imageElement: HTMLImageElement;
  regions: RedactionRegion[];
  currentMode: ToolMode;
  selectedRegionId: string | null;
  onRegionsChange: (newRegions: RedactionRegion[]) => void;
  onSelectRegion: (id: string | null) => void;
}

const HANDLE_SIZE = 8; // Screen px

export const RedactionCanvas: React.FC<RedactionCanvasProps> = ({
  imageElement,
  regions,
  currentMode,
  selectedRegionId,
  onRegionsChange,
  onSelectRegion,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Zoom & View state
  const [zoom, setZoom] = useState<number>(1);
  const [isComparingOriginal, setIsComparingOriginal] = useState<boolean>(false);

  // Drag / Draw interaction state
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [activeHandle, setActiveHandle] = useState<HandleType | null>(null);
  const [dragStartPoint, setDragStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [initialRegionSnapshot, setInitialRegionSnapshot] = useState<RedactionRegion | null>(null);
  const [draftRegion, setDraftRegion] = useState<RedactionRegion | null>(null);

  // Compute natural image to canvas scale
  const imgWidth = imageElement.naturalWidth;
  const imgHeight = imageElement.naturalHeight;

  // Fit image to container initially
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth - 32;
    const containerHeight = Math.min(window.innerHeight * 0.65, 600);

    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const optimalScale = Math.min(scaleX, scaleY, 1);
    setZoom(Number(optimalScale.toFixed(2)));
  }, [imgWidth, imgHeight]);

  useEffect(() => {
    fitToScreen();
  }, [fitToScreen]);

  // Convert client viewport coordinates to natural image pixel coordinates
  const clientToImageCoords = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    
    // Position relative to canvas element
    const canvasX = clientX - rect.left;
    const canvasY = clientY - rect.top;

    // Scale to natural image pixels
    const imgX = (canvasX / rect.width) * imgWidth;
    const imgY = (canvasY / rect.height) * imgHeight;

    return {
      x: Math.max(0, Math.min(imgWidth, Math.round(imgX))),
      y: Math.max(0, Math.min(imgHeight, Math.round(imgY))),
    };
  };

  // Find if click hit a resize handle of the selected region (calculated in screen pixels)
  const getHitHandle = (clientX: number, clientY: number, region: RedactionRegion): HandleType | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;

    const x1 = Math.min(region.x, region.x + region.width) * zoom;
    const y1 = Math.min(region.y, region.y + region.height) * zoom;
    const x2 = Math.max(region.x, region.x + region.width) * zoom;
    const y2 = Math.max(region.y, region.y + region.height) * zoom;
    const xm = (x1 + x2) / 2;
    const ym = (y1 + y2) / 2;

    const hitRadius = HANDLE_SIZE + 4;

    const isNear = (hx: number, hy: number) => Math.hypot(cx - hx, cy - hy) <= hitRadius;

    if (isNear(x1, y1)) return 'tl';
    if (isNear(x2, y1)) return 'tr';
    if (isNear(x1, y2)) return 'bl';
    if (isNear(x2, y2)) return 'br';
    if (isNear(xm, y1)) return 'tc';
    if (isNear(xm, y2)) return 'bc';
    if (isNear(x1, ym)) return 'ml';
    if (isNear(x2, ym)) return 'mr';

    // Inside region body
    if (cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2) {
      return 'move';
    }

    return null;
  };

  // Redraw canvas with permanent pixel-level rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = imgWidth;
    canvas.height = imgHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Draw baseline source image
    ctx.drawImage(imageElement, 0, 0, imgWidth, imgHeight);

    // If "comparing original", skip drawing redactions
    if (!isComparingOriginal) {
      const activeRegions = draftRegion ? [...regions, draftRegion] : regions;
      applyPermanentRedactions(ctx, activeRegions, imgWidth, imgHeight);
    }
  }, [imageElement, regions, draftRegion, isComparingOriginal, imgWidth, imgHeight]);

  // Pointer interactions (Draw / Select / Move / Resize)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isComparingOriginal) return;

    const coords = clientToImageCoords(e.clientX, e.clientY);
    if (!coords) return;

    // If currently in select mode or clicking an existing region
    const selectedRegion = regions.find((r) => r.id === selectedRegionId);

    // Check handles if a region is currently selected
    if (selectedRegion) {
      const handle = getHitHandle(e.clientX, e.clientY, selectedRegion);
      if (handle) {
        setIsInteracting(true);
        setActiveHandle(handle);
        setDragStartPoint(coords);
        setInitialRegionSnapshot({ ...selectedRegion });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }

    // Check if clicked another existing region
    for (let i = regions.length - 1; i >= 0; i--) {
      const r = regions[i];
      const rx1 = Math.min(r.x, r.x + r.width);
      const ry1 = Math.min(r.y, r.y + r.height);
      const rx2 = Math.max(r.x, r.x + r.width);
      const ry2 = Math.max(r.y, r.y + r.height);

      if (coords.x >= rx1 && coords.x <= rx2 && coords.y >= ry1 && coords.y <= ry2) {
        onSelectRegion(r.id);
        setIsInteracting(true);
        setActiveHandle('move');
        setDragStartPoint(coords);
        setInitialRegionSnapshot({ ...r });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }

    // If no existing region was hit and we are in a drawing mode (blackout, pixelate, blur)
    if (currentMode !== 'select') {
      const uniqueId = `redaction-${Math.random().toString(36).substring(2, 9)}`;
      const newDraft: RedactionRegion = {
        id: uniqueId,
        type: currentMode,
        x: coords.x,
        y: coords.y,
        width: 0,
        height: 0,
      };
      setIsInteracting(true);
      setActiveHandle('br');
      setDragStartPoint(coords);
      setDraftRegion(newDraft);
      setInitialRegionSnapshot(newDraft);
      onSelectRegion(null);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      // Clicked empty space in select mode
      onSelectRegion(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting || !dragStartPoint || !initialRegionSnapshot) return;

    const coords = clientToImageCoords(e.clientX, e.clientY);
    if (!coords) return;

    const dx = coords.x - dragStartPoint.x;
    const dy = coords.y - dragStartPoint.y;

    if (draftRegion) {
      // We are creating a new box
      setDraftRegion({
        ...draftRegion,
        width: coords.x - draftRegion.x,
        height: coords.y - draftRegion.y,
      });
      return;
    }

    // Modifying existing region
    const targetId = initialRegionSnapshot.id;
    const updated = regions.map((r) => {
      if (r.id !== targetId) return r;

      const init = initialRegionSnapshot;
      let { x, y, width, height } = init;

      if (activeHandle === 'move') {
        x = Math.max(0, Math.min(imgWidth - Math.abs(width), init.x + dx));
        y = Math.max(0, Math.min(imgHeight - Math.abs(height), init.y + dy));
      } else if (activeHandle === 'br') {
        width = init.width + dx;
        height = init.height + dy;
      } else if (activeHandle === 'tl') {
        x = init.x + dx;
        y = init.y + dy;
        width = init.width - dx;
        height = init.height - dy;
      } else if (activeHandle === 'tr') {
        y = init.y + dy;
        width = init.width + dx;
        height = init.height - dy;
      } else if (activeHandle === 'bl') {
        x = init.x + dx;
        width = init.width - dx;
        height = init.height + dy;
      } else if (activeHandle === 'tc') {
        y = init.y + dy;
        height = init.height - dy;
      } else if (activeHandle === 'bc') {
        height = init.height + dy;
      } else if (activeHandle === 'ml') {
        x = init.x + dx;
        width = init.width - dx;
      } else if (activeHandle === 'mr') {
        width = init.width + dx;
      }

      return {
        ...r,
        x,
        y,
        width,
        height,
      };
    });

    onRegionsChange(updated);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isInteracting) return;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if not captured
    }

    if (draftRegion) {
      // Only keep if region has meaningful size (at least 6x6 pixels)
      if (Math.abs(draftRegion.width) > 6 && Math.abs(draftRegion.height) > 6) {
        // Normalize negative width/height
        const normalized: RedactionRegion = {
          ...draftRegion,
          x: draftRegion.width < 0 ? draftRegion.x + draftRegion.width : draftRegion.x,
          y: draftRegion.height < 0 ? draftRegion.y + draftRegion.height : draftRegion.y,
          width: Math.abs(draftRegion.width),
          height: Math.abs(draftRegion.height),
        };
        onRegionsChange([...regions, normalized]);
        onSelectRegion(normalized.id);
      }
      setDraftRegion(null);
    }

    setIsInteracting(false);
    setActiveHandle(null);
    setDragStartPoint(null);
    setInitialRegionSnapshot(null);
  };

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);

  // Compute bounding box for active selection handles using calculated zoom
  const renderSelectionHandles = () => {
    if (!selectedRegion || isComparingOriginal) return null;

    const x1 = Math.min(selectedRegion.x, selectedRegion.x + selectedRegion.width) * zoom;
    const y1 = Math.min(selectedRegion.y, selectedRegion.y + selectedRegion.height) * zoom;
    const x2 = Math.max(selectedRegion.x, selectedRegion.x + selectedRegion.width) * zoom;
    const y2 = Math.max(selectedRegion.y, selectedRegion.y + selectedRegion.height) * zoom;
    const w = x2 - x1;
    const h = y2 - y1;
    const xm = (x1 + x2) / 2;
    const ym = (y1 + y2) / 2;

    const handles = [
      { id: 'tl', x: x1, y: y1 },
      { id: 'tr', x: x2, y: y1 },
      { id: 'bl', x: x1, y: y2 },
      { id: 'br', x: x2, y: y2 },
      { id: 'tc', x: xm, y: y1 },
      { id: 'bc', x: xm, y: y2 },
      { id: 'ml', x: x1, y: ym },
      { id: 'mr', x: x2, y: ym },
    ];

    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Selection outline */}
        <div
          style={{
            left: `${x1}px`,
            top: `${y1}px`,
            width: `${w}px`,
            height: `${h}px`,
          }}
          className="absolute border-2 border-[#CCFF00] pointer-events-none"
        >
          {/* Label tag */}
          <div className="absolute -top-6 left-0 bg-[#CCFF00] text-[#000000] font-mono text-[10px] font-black px-1.5 py-0.5 uppercase tracking-wider">
            {selectedRegion.type}
          </div>
        </div>

        {/* 8 Handles */}
        {handles.map((h) => (
          <div
            key={h.id}
            style={{
              left: `${h.x - HANDLE_SIZE / 2}px`,
              top: `${h.y - HANDLE_SIZE / 2}px`,
              width: `${HANDLE_SIZE}px`,
              height: `${HANDLE_SIZE}px`,
            }}
            className="absolute bg-[#FFFFFF] border-2 border-[#000000] shadow-sm pointer-events-none"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col bg-[#050505] border-4 border-[#222222] shadow-brutal-lg">
      
      {/* Top Viewport Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] border-b-2 border-[#222222] text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-[#777777] uppercase font-bold">VIEWPORT:</span>
          <span className="text-[#CCFF00] font-numeric font-bold">{Math.round(zoom * 100)}%</span>
          <span className="text-[#555555]">|</span>
          <span className="text-[#AAAAAA]">{imgWidth} × {imgHeight}px</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.2, Number((z - 0.15).toFixed(2))))}
            className="p-1.5 bg-[#181818] border border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00] text-[#FFFFFF]"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, Number((z + 0.15).toFixed(2))))}
            className="p-1.5 bg-[#181818] border border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00] text-[#FFFFFF]"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Fit to screen */}
          <button
            type="button"
            onClick={fitToScreen}
            className="p-1.5 bg-[#181818] border border-[#333333] hover:border-[#CCFF00] hover:text-[#CCFF00] text-[#FFFFFF]"
            title="Fit to screen"
            aria-label="Fit to screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <span className="text-[#555555]">|</span>

          {/* Hold to Compare Original */}
          <button
            type="button"
            onMouseDown={() => setIsComparingOriginal(true)}
            onMouseUp={() => setIsComparingOriginal(false)}
            onMouseLeave={() => setIsComparingOriginal(false)}
            onTouchStart={() => setIsComparingOriginal(true)}
            onTouchEnd={() => setIsComparingOriginal(false)}
            className={`px-3 py-1.5 border font-bold flex items-center gap-1.5 transition-colors ${
              isComparingOriginal
                ? 'bg-[#CCFF00] text-[#000000] border-[#000000]'
                : 'bg-[#181818] text-[#FFFFFF] border-[#333333] hover:border-[#CCFF00]'
            }`}
            title="Press and hold to view original image"
          >
            {isComparingOriginal ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-[#CCFF00]" />}
            <span className="text-[11px] uppercase tracking-wider">
              {isComparingOriginal ? 'SHOWING ORIGINAL' : 'HOLD TO PEEK ORIGINAL'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scrollable Area */}
      <div
        ref={containerRef}
        className="relative overflow-auto p-4 sm:p-6 min-h-[380px] max-h-[640px] flex items-center justify-center bg-[#070707] select-none"
        style={{
          cursor: currentMode === 'select' ? 'default' : 'crosshair',
        }}
      >
        <div
          className="relative inline-block border-2 border-[#333333] shadow-brutal"
          style={{
            width: `${imgWidth * zoom}px`,
            height: `${imgHeight * zoom}px`,
            touchAction: 'none',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Main Working Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
          />

          {/* Active selection bounding box and handles */}
          {renderSelectionHandles()}

          {/* Original watermark banner when comparing */}
          {isComparingOriginal && (
            <div className="absolute top-4 left-4 bg-[#FF0055] text-[#FFFFFF] font-mono font-black text-xs px-3 py-1 border-2 border-[#000000] shadow-brutal tracking-widest uppercase">
              PEEKING UNREDACTED ORIGINAL
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status / Instructions Bar */}
      <div className="p-2.5 bg-[#0D0D0D] border-t border-[#1F1F1F] text-[11px] font-mono text-[#888888] flex flex-wrap items-center justify-between gap-2">
        <span>
          MODE: <strong className="text-[#CCFF00] uppercase font-bold">{currentMode}</strong>
          {' • '}
          {currentMode === 'select'
            ? 'Click a region to select, move, or drag corner handles to resize.'
            : 'Click and drag over sensitive areas to redact.'}
        </span>
        <span>
          REGIONS APPLIED: <strong className="text-[#FFFFFF]">{regions.length}</strong>
        </span>
      </div>

    </div>
  );
};
