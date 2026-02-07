// TTF Export using opentype.js

import opentype from 'opentype.js';
import { PixFontProject, createDefaultMetadata } from './types';

const UNITS_PER_PIXEL = 100;

export function exportTTF(project: PixFontProject): void {
  const { gridWidth, gridHeight, baseline, letterSpacing, glyphs } = project;
  const metadata = project.metadata || createDefaultMetadata();
  
  const unitsPerEm = gridHeight * UNITS_PER_PIXEL;
  const ascender = (gridHeight - baseline) * UNITS_PER_PIXEL;
  const descender = -baseline * UNITS_PER_PIXEL;

  // Create notdef glyph (required)
  const notdefPath = new opentype.Path();
  notdefPath.moveTo(0, 0);
  notdefPath.lineTo(gridWidth * UNITS_PER_PIXEL, 0);
  notdefPath.lineTo(gridWidth * UNITS_PER_PIXEL, gridHeight * UNITS_PER_PIXEL);
  notdefPath.lineTo(0, gridHeight * UNITS_PER_PIXEL);
  notdefPath.closePath();

  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: (gridWidth + letterSpacing) * UNITS_PER_PIXEL,
    path: notdefPath,
  });

  // Create glyphs from pixel data
  const fontGlyphs: opentype.Glyph[] = [notdefGlyph];

  for (const [char, glyph] of Object.entries(glyphs)) {
    const path = new opentype.Path();
    const pixels = glyph.pixels;

    // Convert each active pixel to a rectangle path
    // Note: Font Y-axis is inverted (0 at baseline, positive up)
    for (let row = 0; row < pixels.length; row++) {
      for (let col = 0; col < pixels[row].length; col++) {
        if (pixels[row][col]) {
          // Convert row to font coordinates (flip Y)
          const fontY = (gridHeight - row - 1) * UNITS_PER_PIXEL;
          const fontX = col * UNITS_PER_PIXEL;

          // Draw rectangle clockwise
          path.moveTo(fontX, fontY);
          path.lineTo(fontX + UNITS_PER_PIXEL, fontY);
          path.lineTo(fontX + UNITS_PER_PIXEL, fontY + UNITS_PER_PIXEL);
          path.lineTo(fontX, fontY + UNITS_PER_PIXEL);
          path.closePath();
        }
      }
    }

    const fontGlyph = new opentype.Glyph({
      name: char === ' ' ? 'space' : `uni${glyph.codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: glyph.codePoint,
      advanceWidth: (gridWidth + letterSpacing) * UNITS_PER_PIXEL,
      path: path,
    });

    fontGlyphs.push(fontGlyph);
  }

  // Create font with metadata
  const font = new opentype.Font({
    familyName: metadata.family,
    styleName: 'Regular',
    unitsPerEm,
    ascender,
    descender,
    glyphs: fontGlyphs,
    copyright: metadata.copyright || undefined,
    description: metadata.description || undefined,
    designer: metadata.designer || undefined,
    designerURL: metadata.designerUrl || undefined,
    manufacturer: metadata.vendor || undefined,
    manufacturerURL: metadata.vendorUrl || undefined,
    license: metadata.license || undefined,
    licenseURL: metadata.licenseUrl || undefined,
    version: `Version ${metadata.version}`,
  });

  // Download
  const arrayBuffer = font.toArrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'font/ttf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${metadata.family.toLowerCase().replace(/\s+/g, '-')}.ttf`;
  a.click();
  URL.revokeObjectURL(url);
}
