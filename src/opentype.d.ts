// Type declarations for opentype.js
declare module 'opentype.js' {
  export class Path {
    commands: any[];
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): void;
    quadTo(x1: number, y1: number, x: number, y: number): void;
    closePath(): void;
  }

  export interface GlyphOptions {
    name: string;
    unicode: number;
    advanceWidth: number;
    path: Path;
  }

  export class Glyph {
    constructor(options: GlyphOptions);
    name: string;
    unicode: number;
    advanceWidth: number;
    path: Path;
  }

  export interface FontOptions {
    familyName: string;
    styleName: string;
    unitsPerEm: number;
    ascender: number;
    descender: number;
    glyphs: Glyph[];
  }

  export class Font {
    constructor(options: FontOptions);
    toArrayBuffer(): ArrayBuffer;
    download(fileName?: string): void;
  }
}
