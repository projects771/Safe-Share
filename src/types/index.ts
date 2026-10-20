export type RedactionType = 'blackout' | 'pixelate' | 'blur';

export type ToolMode = 'select' | 'blackout' | 'pixelate' | 'blur';

export interface RedactionRegion {
  id: string;
  type: RedactionType;
  // Coordinates are normalized (0 to 1) or in natural image pixel space
  // We store in natural image pixels for 100% precision regardless of viewport/zoom:
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  intensity?: number; // e.g., pixel size (8-32) or blur radius
}

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export type HandleType = 
  | 'tl' // top-left
  | 'tr' // top-right
  | 'bl' // bottom-left
  | 'br' // bottom-right
  | 'tc' // top-center
  | 'bc' // bottom-center
  | 'ml' // middle-left
  | 'mr' // middle-right
  | 'move'; // inside region
