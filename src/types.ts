// PixFonts Types

export interface Glyph {
  char: string;
  codePoint: number;
  pixels: boolean[][];
}

export interface FontMetadata {
  family: string;
  version: string;
  copyright: string;
  designer: string;
  designerUrl: string;
  license: string;
  licenseUrl: string;
  description: string;
  vendor: string;
  vendorUrl: string;
}

export interface GridMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PixFontProject {
  name: string;
  version: string;
  gridWidth: number;
  gridHeight: number;
  baseline: number;
  letterSpacing: number;
  glyphs: Record<string, Glyph>;
  metadata?: FontMetadata;
  margins?: GridMargins;
}

export const DEFAULT_CHARS = 
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
  'ÁÉÍÓÚÜÑáéíóúüñ' +  // Spanish
  'ÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖäëïö' +  // French/German
  'ÃÕãõÇç' +  // Portuguese
  '.,;:!?\'"()-+=/\\@#$%&*[]{}|<>~`^_ ';

export function createDefaultMetadata(): FontMetadata {
  return {
    family: 'PixFont',
    version: '1.0',
    copyright: '',
    designer: '',
    designerUrl: '',
    license: 'OFL-1.1',
    licenseUrl: 'https://scripts.sil.org/OFL',
    description: 'A pixel font created with PixFonts',
    vendor: '',
    vendorUrl: '',
  };
}

export function createEmptyProject(): PixFontProject {
  return {
    name: 'PixFont',
    version: '1.0',
    gridWidth: 8,
    gridHeight: 10,
    baseline: 8,
    letterSpacing: 1,
    glyphs: {},
    metadata: createDefaultMetadata(),
  };
}

export function createEmptyGlyph(char: string, width: number, height: number): Glyph {
  return {
    char,
    codePoint: char.charCodeAt(0),
    pixels: Array.from({ length: height }, () => Array(width).fill(false)),
  };
}

export function getOrCreateGlyph(project: PixFontProject, char: string): Glyph {
  if (!project.glyphs[char]) {
    project.glyphs[char] = createEmptyGlyph(char, project.gridWidth, project.gridHeight);
  }
  return project.glyphs[char];
}
