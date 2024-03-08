export interface Frame {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}

export interface JsonData {
  frames: Record<string, Frame>;
  animations: any;
  meta: any;
}

export interface SpriteJson {
  frames: Record<string, Frame>;
  meta: {
    image: string;
    scale: string;
    size: { w: number; h: number };
  };
  zIndex?: number;
}

export interface SpriteProps {
  imageSrc: string;
  json: SpriteJson;
}

export interface SpriteFrames {
  [key: string]: Frame;
}

export interface ImageSprite {
  url: string;
  x: number;
  y: number;
  minScroll: number;
  maxScroll: number;
  zIndex?: number;
}
