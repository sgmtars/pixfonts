// TTF Export using opentype.js

import opentype from 'opentype.js';
import { PixFontProject, createDefaultMetadata } from './types';

const UNITS_PER_EM = 1000;

export function exportTTF(project: PixFontProject): void {
  const { gridWidth, gridHeight, baseline, glyphs } = project;
  const metadata = project.metadata || createDefaultMetadata();

  const pixelSize = UNITS_PER_EM / baseline;
  const unitsPerEm = UNITS_PER_EM;
  const ascender = Math.round(baseline * pixelSize);
  const descender = -Math.round((gridHeight - baseline) * pixelSize);

  // Create notdef glyph (required)
  const notdefPath = new opentype.Path();
  notdefPath.moveTo(0, descender);
  notdefPath.lineTo(gridWidth * pixelSize, descender);
  notdefPath.lineTo(gridWidth * pixelSize, ascender);
  notdefPath.lineTo(0, ascender);
  notdefPath.closePath();

  const notdefGlyph = new opentype.Glyph({
    name: '.notdef',
    unicode: 0,
    advanceWidth: gridWidth * pixelSize,
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
          // Convert row to font coordinates (flip Y, relative to baseline)
          const fontY = (baseline - row - 1) * pixelSize;
          const fontX = col * pixelSize;

          // Draw rectangle clockwise
          path.moveTo(fontX, fontY);
          path.lineTo(fontX + pixelSize, fontY);
          path.lineTo(fontX + pixelSize, fontY + pixelSize);
          path.lineTo(fontX, fontY + pixelSize);
          path.closePath();
        }
      }
    }

    const fontGlyph = new opentype.Glyph({
      name: char === ' ' ? 'space' : `uni${glyph.codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: glyph.codePoint,
      advanceWidth: gridWidth * pixelSize,
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
