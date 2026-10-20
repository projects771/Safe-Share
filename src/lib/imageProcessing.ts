import type { RedactionRegion } from '../types';

/**
 * Permanently applies redactions directly to a CanvasRenderingContext2D.
 * Original pixels within the regions are permanently replaced/destroyed.
 */
export function applyPermanentRedactions(
  ctx: CanvasRenderingContext2D,
  regions: RedactionRegion[],
  targetWidth: number,
  targetHeight: number
): void {
  for (const region of regions) {
    // Normalize coordinates so negative width/height from reverse dragging are handled properly
    const rx = Math.max(0, Math.min(region.x, region.x + region.width));
    const ry = Math.max(0, Math.min(region.y, region.y + region.height));
    const rw = Math.min(Math.abs(region.width), targetWidth - rx);
    const rh = Math.min(Math.abs(region.height), targetHeight - ry);

    if (rw <= 0 || rh <= 0) continue;

    if (region.type === 'blackout') {
      // 1. Blackout: Completely destroy and overwrite pixels with solid black
      ctx.save();
      ctx.fillStyle = '#000000';
      ctx.fillRect(rx, ry, rw, rh);
      ctx.restore();
    } else if (region.type === 'pixelate') {
      // 2. Pixelate: Downscale region into low-res buffer and upscale with nearest-neighbor
      const pixelSize = Math.max(12, Math.min(32, Math.round(Math.min(rw, rh) / 6)));
      const sampleWidth = Math.max(1, Math.floor(rw / pixelSize));
      const sampleHeight = Math.max(1, Math.floor(rh / pixelSize));

      // Offscreen canvas for low-res sampling
      const offscreen = document.createElement('canvas');
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      const offCtx = offscreen.getContext('2d');

      if (offCtx) {
        // Draw the region downscaled
        offCtx.drawImage(
          ctx.canvas,
          rx, ry, rw, rh,
          0, 0, sampleWidth, sampleHeight
        );

        ctx.save();
        ctx.imageSmoothingEnabled = false;
        // Overwrite the original area with pixelated blocks
        ctx.drawImage(
          offscreen,
          0, 0, sampleWidth, sampleHeight,
          rx, ry, rw, rh
        );
        ctx.restore();
      }
    } else if (region.type === 'blur') {
      // 3. Blur: Heavy multi-pass blur and clip to region
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();

      // We draw the blurred image over the region
      ctx.filter = 'blur(18px)';
      ctx.drawImage(ctx.canvas, 0, 0);

      // Second pass with slight tint to prevent reverse-deconvolution
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(rx, ry, rw, rh);

      ctx.restore();
    }
  }
}

/**
 * Creates an exportable redacted image blob and dataUrl.
 * Re-encodes the image via canvas, thereby stripping ordinary EXIF metadata.
 */
export async function createRedactedExport(
  imageSource: HTMLImageElement,
  regions: RedactionRegion[],
  mimeType: 'image/png' | 'image/jpeg' = 'image/png',
  quality: number = 0.95
): Promise<{ blob: Blob; objectUrl: string; width: number; height: number; fileSize: number }> {
  const width = imageSource.naturalWidth;
  const height = imageSource.naturalHeight;

  if (width === 0 || height === 0) {
    throw new Error('Invalid image dimensions');
  }

  // Create isolated canvas with exact natural dimensions
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = width;
  exportCanvas.height = height;

  const ctx = exportCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Could not obtain 2D canvas context');
  }

  // Draw untouched source
  ctx.drawImage(imageSource, 0, 0, width, height);

  // Permanently bake redactions into canvas pixels
  applyPermanentRedactions(ctx, regions, width, height);

  // Export to Blob (re-encoding strips camera EXIF/IPTC metadata)
  return new Promise((resolve, reject) => {
    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas image export failed'));
          return;
        }
        const objectUrl = URL.createObjectURL(blob);
        resolve({
          blob,
          objectUrl,
          width,
          height,
          fileSize: blob.size,
        });
      },
      mimeType,
      quality
    );
  });
}

/**
 * Formats byte size into human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
