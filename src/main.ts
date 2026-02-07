import './style.css';

declare const __BUILD_TIME__: string;
import { PixFontProject, DEFAULT_CHARS, getOrCreateGlyph } from './types';
import { loadProject, saveProject, importProjectFile } from './storage';
import { PixelEditor } from './editor';
import { exportTTF } from './export';

class PixFontsApp {
  private project: PixFontProject;
  private currentCharIndex: number = 0;
  private chars: string[];
  private editor: PixelEditor | null = null;
  private menuOpen: boolean = false;

  constructor() {
    this.project = loadProject();
    this.chars = DEFAULT_CHARS.split('');
    this.render();
    this.setupKeyboardNav();
  }

  private get currentChar(): string {
    return this.chars[this.currentCharIndex];
  }

  private render(): void {
    const app = document.getElementById('app')!;
    const VERSION = __BUILD_TIME__;

    app.innerHTML = `
      <header class="menu-bar">
        <div class="logo">🔲 PixFonts <span class="version">v${VERSION}</span></div>
        <button class="menu-toggle" aria-label="Menu">☰</button>
        <nav class="menu-items">
          <button id="btn-save">💾 Save</button>
          <button id="btn-load">📂 Load</button>
          <button id="btn-export">📦 Export TTF</button>
        </nav>
      </header>

      <main class="workspace">
        <section class="editor-panel">
          <div id="editor-container"></div>
          <div class="char-nav">
            <button id="btn-prev">◀</button>
            <span class="current-char" id="current-char">${this.escapeHtml(this.currentChar)}</span>
            <button id="btn-next">▶</button>
          </div>
          <div class="grid-size">
            <label>Size:</label>
            <input type="number" id="grid-width" value="${this.project.gridWidth}" min="4" max="32">
            <span>×</span>
            <input type="number" id="grid-height" value="${this.project.gridHeight}" min="4" max="32">
            <button id="btn-resize">Apply</button>
          </div>
        </section>

        <section class="grid-panel">
          <div class="char-grid" id="char-grid"></div>
        </section>

        <section class="preview-panel">
          <textarea id="preview-text" placeholder="Preview text..." rows="2">Hello World</textarea>
          <div class="preview-output" id="preview-output"></div>
        </section>
      </main>
    `;

    this.setupEditor();
    this.setupCharGrid();
    this.setupEvents();
    this.updatePreview();
  }

  private escapeHtml(str: string): string {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML || '&nbsp;';
  }

  private setupEditor(): void {
    const container = document.getElementById('editor-container')!;
    const glyph = getOrCreateGlyph(this.project, this.currentChar);
    
    this.editor = new PixelEditor({
      container,
      glyph,
      onChange: () => {
        this.autoSave();
        this.updateCharGrid();
        this.updatePreview();
      },
    });
  }

  private setupCharGrid(): void {
    const grid = document.getElementById('char-grid')!;
    grid.innerHTML = '';

    for (let i = 0; i < this.chars.length; i++) {
      const char = this.chars[i];
      const btn = document.createElement('button');
      btn.className = 'char-btn' + (i === this.currentCharIndex ? ' selected' : '');
      btn.textContent = char === ' ' ? '␣' : char;
      btn.title = char === ' ' ? 'Space' : char;
      
      const glyph = this.project.glyphs[char];
      if (glyph && glyph.pixels.some(row => row.some(p => p))) {
        btn.classList.add('has-content');
      }

      btn.addEventListener('click', () => this.selectChar(i));
      grid.appendChild(btn);
    }
  }

  private updateCharGrid(): void {
    const grid = document.getElementById('char-grid')!;
    const buttons = grid.querySelectorAll('.char-btn');
    
    buttons.forEach((btn, i) => {
      btn.classList.toggle('selected', i === this.currentCharIndex);
      const char = this.chars[i];
      const glyph = this.project.glyphs[char];
      const hasContent = glyph && glyph.pixels.some(row => row.some(p => p));
      btn.classList.toggle('has-content', hasContent);
    });
  }

  private selectChar(index: number): void {
    this.currentCharIndex = index;
    const glyph = getOrCreateGlyph(this.project, this.currentChar);
    this.editor?.setGlyph(glyph);
    
    document.getElementById('current-char')!.innerHTML = this.escapeHtml(this.currentChar);
    this.updateCharGrid();
  }

  private setupEvents(): void {
    // Navigation
    document.getElementById('btn-prev')!.addEventListener('click', () => {
      this.selectChar((this.currentCharIndex - 1 + this.chars.length) % this.chars.length);
    });
    
    document.getElementById('btn-next')!.addEventListener('click', () => {
      this.selectChar((this.currentCharIndex + 1) % this.chars.length);
    });

    // Menu
    document.getElementById('btn-save')!.addEventListener('click', () => {
      saveProject(this.project);
      this.showToast('Saved!');
    });

    document.getElementById('btn-load')!.addEventListener('click', async () => {
      try {
        this.project = await importProjectFile();
        saveProject(this.project);
        this.render();
        this.showToast('Loaded!');
      } catch (e) {
        console.error(e);
      }
    });

    document.getElementById('btn-export')!.addEventListener('click', () => {
      try {
        exportTTF(this.project);
        this.showToast('TTF exported!');
      } catch (e) {
        console.error('Export failed:', e);
        this.showToast('Export failed');
      }
    });

    // Mobile menu toggle
    document.querySelector('.menu-toggle')!.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;
      document.querySelector('.menu-items')!.classList.toggle('open', this.menuOpen);
    });

    // Grid resize
    document.getElementById('btn-resize')!.addEventListener('click', () => {
      const newWidth = parseInt((document.getElementById('grid-width') as HTMLInputElement).value, 10);
      const newHeight = parseInt((document.getElementById('grid-height') as HTMLInputElement).value, 10);
      
      if (newWidth < 4 || newWidth > 32 || newHeight < 4 || newHeight > 32) {
        this.showToast('Size must be 4-32');
        return;
      }

      if (newWidth === this.project.gridWidth && newHeight === this.project.gridHeight) {
        return;
      }

      // Resize all existing glyphs
      for (const glyph of Object.values(this.project.glyphs)) {
        const oldPixels = glyph.pixels;
        const newPixels: boolean[][] = [];
        
        for (let row = 0; row < newHeight; row++) {
          newPixels[row] = [];
          for (let col = 0; col < newWidth; col++) {
            newPixels[row][col] = oldPixels[row]?.[col] ?? false;
          }
        }
        glyph.pixels = newPixels;
      }

      this.project.gridWidth = newWidth;
      this.project.gridHeight = newHeight;
      this.autoSave();
      
      // Re-render editor with new size
      const glyph = getOrCreateGlyph(this.project, this.currentChar);
      this.editor?.setGlyph(glyph);
      this.setupEditor();
      this.updatePreview();
      this.showToast(`Resized to ${newWidth}×${newHeight}`);
    });

    // Preview
    document.getElementById('preview-text')!.addEventListener('input', () => {
      this.updatePreview();
    });
  }

  private setupKeyboardNav(): void {
    document.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.selectChar((this.currentCharIndex - 1 + this.chars.length) % this.chars.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.selectChar((this.currentCharIndex + 1) % this.chars.length);
      }
    });
  }

  private updatePreview(): void {
    const text = (document.getElementById('preview-text') as HTMLTextAreaElement)?.value || '';
    const output = document.getElementById('preview-output')!;
    output.innerHTML = '';

    const { gridWidth, gridHeight } = this.project;
    const scale = 3;
    const lines = text.split('\n');
    const maxLineLength = Math.max(...lines.map(l => l.length), 1);

    const canvas = document.createElement('canvas');
    canvas.width = maxLineLength * (gridWidth + 1) * scale;
    canvas.height = lines.length * (gridHeight + 2) * scale;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#eee';

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const offsetY = lineIdx * (gridHeight + 2) * scale;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const glyph = this.project.glyphs[char];
        if (!glyph) continue;

        const offsetX = i * (gridWidth + 1) * scale;
        for (let row = 0; row < glyph.pixels.length; row++) {
          for (let col = 0; col < glyph.pixels[row].length; col++) {
            if (glyph.pixels[row][col]) {
              ctx.fillRect(offsetX + col * scale, offsetY + row * scale, scale, scale);
            }
          }
        }
      }
    }

    output.appendChild(canvas);
  }

  private autoSave(): void {
    saveProject(this.project);
  }

  private showToast(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }
}

new PixFontsApp();

// Prevent pinch zoom globally
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });
