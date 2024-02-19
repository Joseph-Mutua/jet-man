export interface Frame {
  frame: { x: number; y: number; w: number; h: number };
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: { x: number; y: number; w: number; h: number };
  sourceSize: { w: number; h: number };
}




export interface SpriteJson {
  frames: Record<string, Frame>;
  meta: {
    image: string;
    scale: string;
    size: { w: number; h: number };
  };
}

export interface SpriteProps {
  imageSrc: string;
  json: SpriteJson;
}