import './style.css';

declare const __BUILD_TIME__: string;

const PREVIEW_PRESETS: Record<string, string> = {
  pangram: 'The quick brown fox jumps over the lazy dog.\nEL VELOZ MURCIÉLAGO HINDÚ COMÍA FELIZ CARDILLO Y KIWI.',
  literary: `En un lugar de la Mancha,
de cuyo nombre no quiero acordarme,
no ha mucho tiempo que vivía
un hidalgo de los de lanza en astillero.`,
  code: `function hello(name) {
  const msg = "Hello, " + name;
  console.log(msg);
  return { ok: true };
}`,
};

// Syntax highlighting colors
const SYNTAX_COLORS: Record<string, string> = {
  keyword: '#c678dd',    // purple
  string: '#98c379',     // green
  number: '#d19a66',     // orange
  comment: '#5c6370',    // gray
  function: '#61afef',   // blue
  operator: '#56b6c2',   // cyan
  default: '#eeeeee',    // white
};

interface Token {
  text: string;
  color: string;
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  const keywords = /\b(function|const|let|var|return|if|else|for|while|true|false|null|undefined|new|class|import|export|from|async|await)\b/g;
  const strings = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
  const numbers = /\b\d+\.?\d*\b/g;
  const comments = /\/\/.*/g;
  
  // Simple tokenization - find all matches and sort by position
  const matches: { start: number; end: number; text: string; color: string }[] = [];
  
  let match;
  while ((match = keywords.exec(line)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX_COLORS.keyword });
  }
  while ((match = strings.exec(line)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX_COLORS.string });
  }
  while ((match = numbers.exec(line)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX_COLORS.number });
  }
  while ((match = comments.exec(line)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, text: match[0], color: SYNTAX_COLORS.comment });
  }
  
  // Sort by start position
  matches.sort((a, b) => a.start - b.start);
  
  // Build tokens, filling gaps with default color
  let pos = 0;
  for (const m of matches) {
    if (m.start > pos) {
      tokens.push({ text: line.slice(pos, m.start), color: SYNTAX_COLORS.default });
    }
    if (m.start >= pos) {
      tokens.push({ text: m.text, color: m.color });
      pos = m.end;
    }
  }
  if (pos < line.length) {
    tokens.push({ text: line.slice(pos), color: SYNTAX_COLORS.default });
  }
  
  return tokens.length > 0 ? tokens : [{ text: line, color: SYNTAX_COLORS.default }];
}
import { PixFontProject, DEFAULT_CHARS, getOrCreateGlyph } from './types';
import { loadProject, saveProject, importProjectFile, exportProjectFile } from './storage';
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
          <button id="btn-load">📂 Load JSON</button>
          <button id="btn-export-json">📄 Export JSON</button>
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
          <div class="preview-controls">
            <select id="preview-preset">
              <option value="custom">Custom text</option>
              <option value="pangram">Pangram</option>
              <option value="literary">Literary</option>
              <option value="code">Code</option>
            </select>
          </div>
          <textarea id="preview-text" placeholder="Preview text..." rows="3">Hello World</textarea>
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

  private hasGlyphContent(char: string): boolean {
    const glyph = this.project.glyphs[char];
    if (!glyph || !glyph.pixels) return false;
    return glyph.pixels.some(row => row.some(p => p));
  }

  private setupCharGrid(): void {
    const grid = document.getElementById('char-grid')!;
    grid.innerHTML = '';

    for (let i = 0; i < this.chars.length; i++) {
      const char = this.chars[i];
      const btn = document.createElement('button');
      btn.className = 'char-btn';
      btn.dataset.index = i.toString();
      btn.textContent = char === ' ' ? '␣' : char;
      btn.title = char === ' ' ? 'Space' : char;
      btn.addEventListener('click', () => this.selectChar(i));
      grid.appendChild(btn);
    }
    
    this.updateCharGrid();
  }

  private updateCharGrid(): void {
    const grid = document.getElementById('char-grid')!;
    const buttons = grid.querySelectorAll('.char-btn');
    
    buttons.forEach((btn, i) => {
      const char = this.chars[i];
      const isSelected = i === this.currentCharIndex;
      const hasContent = this.hasGlyphContent(char);
      
      // Clear and re-apply classes explicitly
      btn.classList.remove('selected', 'has-content');
      if (isSelected) btn.classList.add('selected');
      if (hasContent) btn.classList.add('has-content');
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

    document.getElementById('btn-export-json')!.addEventListener('click', () => {
      exportProjectFile(this.project);
      this.showToast('JSON exported!');
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
      // Switch to custom when user types
      (document.getElementById('preview-preset') as HTMLSelectElement).value = 'custom';
      this.updatePreview();
    });

    document.getElementById('preview-preset')!.addEventListener('change', (e) => {
      const preset = (e.target as HTMLSelectElement).value;
      const textarea = document.getElementById('preview-text') as HTMLTextAreaElement;
      if (preset !== 'custom' && PREVIEW_PRESETS[preset]) {
        textarea.value = PREVIEW_PRESETS[preset];
        this.updatePreview();
      }
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
    const preset = (document.getElementById('preview-preset') as HTMLSelectElement)?.value || 'custom';
    const output = document.getElementById('preview-output')!;
    output.innerHTML = '';

    const { gridWidth, gridHeight } = this.project;
    const scale = 3;
    const lines = text.split('\n');
    const maxLineLength = Math.max(...lines.map(l => l.length), 1);
    const useSyntaxHighlight = preset === 'code';

    const canvas = document.createElement('canvas');
    canvas.width = maxLineLength * (gridWidth + 1) * scale;
    canvas.height = lines.length * (gridHeight + 2) * scale;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const line = lines[lineIdx];
      const offsetY = lineIdx * (gridHeight + 2) * scale;

      if (useSyntaxHighlight) {
        // Render with syntax highlighting
        const tokens = tokenizeLine(line);
        let charPos = 0;
        for (const token of tokens) {
          ctx.fillStyle = token.color;
          for (let i = 0; i < token.text.length; i++) {
            const char = token.text[i];
            const glyph = this.project.glyphs[char];
            if (glyph) {
              const offsetX = charPos * (gridWidth + 1) * scale;
              for (let row = 0; row < glyph.pixels.length; row++) {
                for (let col = 0; col < glyph.pixels[row].length; col++) {
                  if (glyph.pixels[row][col]) {
                    ctx.fillRect(offsetX + col * scale, offsetY + row * scale, scale, scale);
                  }
                }
              }
            }
            charPos++;
          }
        }
      } else {
        // Render without highlighting
        ctx.fillStyle = '#eee';
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

// Prevent pinch zoom globally (iOS Safari)
document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
  (e.target as HTMLElement)?.blur?.();
}, { passive: false });

document.addEventListener('gesturechange', (e) => {
  e.preventDefault();
}, { passive: false });

document.addEventListener('gestureend', (e) => {
  e.preventDefault();
}, { passive: false });

// Prevent multi-touch zoom
let lastTouchEnd = 0;
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Prevent double-tap zoom
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Prevent zoom via ctrl+wheel (desktop)
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Force reset zoom on iOS Safari via meta viewport manipulation
function resetZoom() {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    setTimeout(() => {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }, 100);
  }
}

// Monitor visualViewport for zoom and counter it
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    if (window.visualViewport!.scale > 1.01) {
      resetZoom();
      // Scroll to compensate
      window.scrollTo(0, window.scrollY);
    }
  });
}
