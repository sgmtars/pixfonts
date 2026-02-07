// Pixel Grid Editor Component

import { Glyph } from './types';

export interface EditorOptions {
  container: HTMLElement;
  glyph: Glyph;
  onChange: () => void;
  onStrokeStart?: () => void;
}

export class PixelEditor {
  private container: HTMLElement;
  private glyph: Glyph;
  private onChange: () => void;
  private onStrokeStart: (() => void) | undefined;
  private grid: HTMLDivElement;
  private painting: boolean = false;
  private paintValue: boolean = true;

  constructor(options: EditorOptions) {
    this.container = options.container;
    this.glyph = options.glyph;
    this.onChange = options.onChange;
    this.onStrokeStart = options.onStrokeStart;
    this.grid = document.createElement('div');
    this.grid.className = 'pixel-grid';
    this.render();
  }

  setGlyph(glyph: Glyph): void {
    this.glyph = glyph;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    this.grid = document.createElement('div');
    this.grid.className = 'pixel-grid';
    
    const height = this.glyph.pixels.length;
    const width = this.glyph.pixels[0]?.length || 8;
    
    this.grid.style.setProperty('--grid-cols', width.toString());
    this.grid.style.setProperty('--grid-rows', height.toString());

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const cell = document.createElement('div');
        cell.className = 'pixel-cell' + (this.glyph.pixels[row][col] ? ' active' : '');
        cell.dataset.row = row.toString();
        cell.dataset.col = col.toString();
        this.grid.appendChild(cell);
      }
    }

    // Mouse events
    this.grid.addEventListener('mousedown', this.handlePointerStart.bind(this));
    this.grid.addEventListener('mousemove', this.handlePointerMove.bind(this));
    document.addEventListener('mouseup', this.handlePointerEnd.bind(this));

    // Touch events
    this.grid.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.grid.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.grid.addEventListener('touchend', this.handlePointerEnd.bind(this));

    this.container.appendChild(this.grid);
  }

  private getCellFromEvent(e: MouseEvent | Touch): HTMLElement | null {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target?.classList.contains('pixel-cell')) {
      return target as HTMLElement;
    }
    return null;
  }

  private toggleCell(cell: HTMLElement, value?: boolean): void {
    const row = parseInt(cell.dataset.row!, 10);
    const col = parseInt(cell.dataset.col!, 10);
    
    const newValue = value !== undefined ? value : !this.glyph.pixels[row][col];
    if (this.glyph.pixels[row][col] !== newValue) {
      this.glyph.pixels[row][col] = newValue;
      cell.classList.toggle('active', newValue);
      this.onChange();
    }
  }

  private handlePointerStart(e: MouseEvent): void {
    e.preventDefault();
    const cell = this.getCellFromEvent(e);
    if (cell) {
      this.onStrokeStart?.();
      this.painting = true;
      const row = parseInt(cell.dataset.row!, 10);
      const col = parseInt(cell.dataset.col!, 10);
      this.paintValue = !this.glyph.pixels[row][col];
      this.toggleCell(cell, this.paintValue);
    }
  }

  private handlePointerMove(e: MouseEvent): void {
    if (!this.painting) return;
    const cell = this.getCellFromEvent(e);
    if (cell) {
      this.toggleCell(cell, this.paintValue);
    }
  }

  private handlePointerEnd(): void {
    this.painting = false;
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = this.getCellFromEvent(touch);
    if (cell) {
      this.onStrokeStart?.();
      this.painting = true;
      const row = parseInt(cell.dataset.row!, 10);
      const col = parseInt(cell.dataset.col!, 10);
      this.paintValue = !this.glyph.pixels[row][col];
      this.toggleCell(cell, this.paintValue);
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.painting) return;
    const touch = e.touches[0];
    const cell = this.getCellFromEvent(touch);
    if (cell) {
      this.toggleCell(cell, this.paintValue);
    }
  }
}
