// PixFonts Types

export interface Glyph {
  char: string;
  codePoint: number;
  pixels: boolean[][];
}

export interface PixFontProject {
  name: string;
  version: string;
  gridWidth: number;
  gridHeight: number;
  baseline: number;
  letterSpacing: number;
  glyphs: Record<string, Glyph>;
}

export const DEFAULT_CHARS = 
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
  'ÁÉÍÓÚÜÑáéíóúüñ' +  // Spanish
  'ÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖäëïö' +  // French/German
  'ÃÕãõÇç' +  // Portuguese
  '.,;:!?\'"()-+=/\\@#$%&*[]{}|<>~`^_ ';

export function createEmptyProject(): PixFontProject {
  return {
    name: 'PixFont',
    version: '1.0',
    gridWidth: 8,
    gridHeight: 10,
    baseline: 8,
    letterSpacing: 1,
    glyphs: {},
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
