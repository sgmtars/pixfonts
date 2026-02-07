import './style.css';

declare const __BUILD_TIME__: string;

// SVG Icons
const ICONS = {
  logo: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
    <rect x="2" y="2" width="6" height="6" rx="1"/><rect x="12" y="2" width="6" height="6" rx="1"/>
    <rect x="2" y="12" width="6" height="6" rx="1"/><rect x="12" y="12" width="6" height="6" rx="1"/>
  </svg>`,
  menu: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <line x1="3" y1="5" x2="17" y2="5"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="15" x2="17" y2="15"/>
  </svg>`,
  folder: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>`,
  download: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>`,
  file: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>`,
  package: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>`,
  chevronLeft: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>`,
  chevronRight: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>`,
  copy: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`,
  paste: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>`,
  settings: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>`,
  close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>`,
  undo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>`,
  redo: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/>
  </svg>`,
};

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
  markdown: `# Heading 1
## Heading 2
### Heading 3

This is **bold** and this is *italic*.

- List item 1
- List item 2
- List item 3

> A blockquote with
> multiple lines.

Inline \`code\` and more text.`,
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
import { PixFontProject, DEFAULT_CHARS, getOrCreateGlyph, FontMetadata, createDefaultMetadata } from './types';
import { loadProject, saveProject, importProjectFile, exportProjectFile, loadPreviewText, savePreviewText, loadPreviewPreset, savePreviewPreset } from './storage';
import { PixelEditor } from './editor';
import { exportTTF } from './export';

class PixFontsApp {
  private project: PixFontProject;
  private currentCharIndex: number = 0;
  private chars: string[];
  private editor: PixelEditor | null = null;
  private menuOpen: boolean = false;
  private clipboard: boolean[][] | null = null;
  private undoStack: Map<string, boolean[][][]> = new Map();
  private redoStack: Map<string, boolean[][][]> = new Map();

  constructor() {
    this.project = loadProject();
    this.chars = DEFAULT_CHARS.split('');
    this.render();
    this.setupKeyboardNav();
  }

  private get currentChar(): string {
    return this.chars[this.currentCharIndex];
  }

  private getMetadata(): FontMetadata {
    return this.project.metadata || createDefaultMetadata();
  }

  private render(): void {
    const app = document.getElementById('app')!;
    const VERSION = __BUILD_TIME__;

    app.innerHTML = `
      <header class="menu-bar">
        <div class="logo">${ICONS.logo} PixFonts <span class="version">v${VERSION}</span></div>
        <button class="menu-toggle" aria-label="Menu">${ICONS.menu}</button>
        <nav class="menu-items">
          <button id="btn-new">${ICONS.plus} New</button>
          <button id="btn-load">${ICONS.folder} Load JSON</button>
          <a href="example-pixfont-8x16.json" download class="menu-link">${ICONS.download} Example 8×16</a>
          <button id="btn-export-json">${ICONS.file} Export JSON</button>
          <button id="btn-export">${ICONS.package} Export TTF</button>
          <button id="btn-settings">${ICONS.settings} Metadata</button>
        </nav>
      </header>

      <main class="workspace">
        <div class="left-column">
          <section class="editor-panel">
            <div id="editor-container"></div>
            <div class="char-nav">
              <button id="btn-prev">${ICONS.chevronLeft}</button>
              <span class="current-char" id="current-char">${this.escapeHtml(this.currentChar)}</span>
              <button id="btn-next">${ICONS.chevronRight}</button>
            </div>
            <div class="char-actions">
              <button id="btn-undo" title="Undo">${ICONS.undo}</button>
              <button id="btn-redo" title="Redo">${ICONS.redo}</button>
              <button id="btn-copy" title="Copy glyph">${ICONS.copy}</button>
              <button id="btn-paste" title="Paste glyph">${ICONS.paste}</button>
            </div>
          </section>

          <section class="grid-panel">
            <div class="char-grid" id="char-grid"></div>
          </section>
        </div>

        <section class="preview-panel">
          <div class="preview-controls">
            <select id="preview-preset">
              <option value="custom">Custom text</option>
              <option value="pangram">Pangram</option>
              <option value="literary">Literary</option>
              <option value="code">Code</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>
          <textarea id="preview-text" placeholder="Preview text..." rows="5">${this.escapeHtml(loadPreviewText())}</textarea>
          <div class="preview-output" id="preview-output"></div>
        </section>
      </main>

      <div id="settings-modal" class="modal hidden">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Font Metadata</h2>
            <button class="modal-close" id="btn-close-settings">${ICONS.close}</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="meta-family">Font Family</label>
              <input type="text" id="meta-family" value="${this.escapeHtml(this.getMetadata().family)}" placeholder="MyPixelFont">
            </div>
            <div class="form-group">
              <label for="meta-version">Version</label>
              <input type="text" id="meta-version" value="${this.escapeHtml(this.getMetadata().version)}" placeholder="1.0">
            </div>
            <div class="form-group">
              <label for="meta-copyright">Copyright</label>
              <input type="text" id="meta-copyright" value="${this.escapeHtml(this.getMetadata().copyright)}" placeholder="© 2026 Your Name">
            </div>
            <div class="form-group">
              <label for="meta-designer">Designer</label>
              <input type="text" id="meta-designer" value="${this.escapeHtml(this.getMetadata().designer)}" placeholder="Your Name">
            </div>
            <div class="form-group">
              <label for="meta-designer-url">Designer URL</label>
              <input type="url" id="meta-designer-url" value="${this.escapeHtml(this.getMetadata().designerUrl)}" placeholder="https://yoursite.com">
            </div>
            <div class="form-group">
              <label for="meta-description">Description</label>
              <textarea id="meta-description" rows="2" placeholder="A pixel font for...">${this.escapeHtml(this.getMetadata().description)}</textarea>
            </div>
            <div class="form-group">
              <label for="meta-license">License</label>
              <input type="text" id="meta-license" value="${this.escapeHtml(this.getMetadata().license)}" placeholder="OFL-1.1">
            </div>
            <div class="form-group">
              <label for="meta-license-url">License URL</label>
              <input type="url" id="meta-license-url" value="${this.escapeHtml(this.getMetadata().licenseUrl)}" placeholder="https://scripts.sil.org/OFL">
            </div>
            <div class="form-group">
              <label for="meta-vendor">Vendor</label>
              <input type="text" id="meta-vendor" value="${this.escapeHtml(this.getMetadata().vendor)}" placeholder="Your Company">
            </div>
            <div class="form-group">
              <label for="meta-vendor-url">Vendor URL</label>
              <input type="url" id="meta-vendor-url" value="${this.escapeHtml(this.getMetadata().vendorUrl)}" placeholder="https://company.com">
            </div>
          </div>
          <div class="modal-footer">
            <button id="btn-save-metadata" class="btn-primary">Save Metadata</button>
          </div>
        </div>
      </div>

      <div id="new-font-modal" class="modal hidden">
        <div class="modal-backdrop"></div>
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h2>New Font</h2>
            <button class="modal-close" id="btn-close-new">${ICONS.close}</button>
          </div>
          <div class="modal-body">
            <p class="modal-warning">This will erase the current font. Make sure to export it first if you want to keep it.</p>
            <div class="form-row">
              <div class="form-group">
                <label for="new-width">Width</label>
                <input type="number" id="new-width" value="8" min="4" max="32">
              </div>
              <div class="form-group">
                <label for="new-height">Height</label>
                <input type="number" id="new-height" value="12" min="4" max="32">
              </div>
            </div>
            <p class="form-section-title">Safe margins</p>
            <div class="form-row">
              <div class="form-group">
                <label for="margin-top">Top</label>
                <input type="number" id="margin-top" value="2" min="0" max="16">
              </div>
              <div class="form-group">
                <label for="margin-bottom">Bottom</label>
                <input type="number" id="margin-bottom" value="1" min="0" max="16">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="margin-left">Left</label>
                <input type="number" id="margin-left" value="1" min="0" max="16">
              </div>
              <div class="form-group">
                <label for="margin-right">Right</label>
                <input type="number" id="margin-right" value="1" min="0" max="16">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button id="btn-cancel-new" class="btn-secondary">Cancel</button>
            <button id="btn-create-new" class="btn-primary">Create</button>
          </div>
        </div>
      </div>
    `;

    this.setupEditor();
    this.setupCharGrid();
    this.setupEvents();
    
    // Restore saved preset
    (document.getElementById('preview-preset') as HTMLSelectElement).value = loadPreviewPreset();
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
      onStrokeStart: () => {
        this.saveUndoState();
      },
      margins: this.project.margins,
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

    // Copy/Paste
    document.getElementById('btn-undo')!.addEventListener('click', () => this.undo());
    document.getElementById('btn-redo')!.addEventListener('click', () => this.redo());
    document.getElementById('btn-copy')!.addEventListener('click', () => this.copyGlyph());
    document.getElementById('btn-paste')!.addEventListener('click', () => this.pasteGlyph());

    // Menu
    document.getElementById('btn-new')!.addEventListener('click', () => {
      this.openNewFontModal();
    });

    document.getElementById('btn-close-new')!.addEventListener('click', () => {
      this.closeNewFontModal();
    });

    document.getElementById('btn-cancel-new')!.addEventListener('click', () => {
      this.closeNewFontModal();
    });

    document.getElementById('btn-create-new')!.addEventListener('click', () => {
      this.createNewFont();
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => {
        this.closeSettingsModal();
        this.closeNewFontModal();
      });
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

    // Settings modal
    document.getElementById('btn-settings')!.addEventListener('click', () => {
      this.openSettingsModal();
    });

    document.getElementById('btn-close-settings')!.addEventListener('click', () => {
      this.closeSettingsModal();
    });

    document.getElementById('btn-save-metadata')!.addEventListener('click', () => {
      this.saveMetadata();
    });

    // Mobile menu toggle
    document.querySelector('.menu-toggle')!.addEventListener('click', () => {
      this.menuOpen = !this.menuOpen;
      document.querySelector('.menu-items')!.classList.toggle('open', this.menuOpen);
    });

    // Preview
    document.getElementById('preview-text')!.addEventListener('input', () => {
      // Switch to custom when user types
      (document.getElementById('preview-preset') as HTMLSelectElement).value = 'custom';
      savePreviewPreset('custom');
      const text = (document.getElementById('preview-text') as HTMLTextAreaElement).value;
      savePreviewText(text);
      this.updatePreview();
    });

    document.getElementById('preview-preset')!.addEventListener('change', (e) => {
      const preset = (e.target as HTMLSelectElement).value;
      savePreviewPreset(preset);
      const textarea = document.getElementById('preview-text') as HTMLTextAreaElement;
      if (preset !== 'custom' && PREVIEW_PRESETS[preset]) {
        textarea.value = PREVIEW_PRESETS[preset];
        savePreviewText(textarea.value);
      }
      this.updatePreview();
    });
  }

  private setupKeyboardNav(): void {
    document.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.selectChar((this.currentCharIndex - 1 + this.chars.length) % this.chars.length);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.selectChar((this.currentCharIndex + 1) % this.chars.length);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        this.copyGlyph();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        this.pasteGlyph();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  private copyGlyph(): void {
    const glyph = this.project.glyphs[this.currentChar];
    if (glyph && glyph.pixels) {
      // Deep copy the pixels array
      this.clipboard = glyph.pixels.map(row => [...row]);
      this.showToast(`Copied "${this.currentChar}"`);
    }
  }

  private pasteGlyph(): void {
    if (!this.clipboard) {
      this.showToast('Nothing to paste');
      return;
    }
    
    this.saveUndoState();
    
    const glyph = getOrCreateGlyph(this.project, this.currentChar);
    const { gridWidth, gridHeight } = this.project;
    
    // Paste with size adaptation
    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        glyph.pixels[row][col] = this.clipboard[row]?.[col] ?? false;
      }
    }
    
    this.editor?.setGlyph(glyph);
    this.autoSave();
    this.updateCharGrid();
    this.updatePreview();
    this.showToast(`Pasted to "${this.currentChar}"`);
  }

  private saveUndoState(): void {
    const char = this.currentChar;
    const glyph = this.project.glyphs[char];
    if (!glyph) return;
    
    // Deep copy current state
    const state = glyph.pixels.map(row => [...row]);
    
    // Get or create undo stack for this char
    if (!this.undoStack.has(char)) {
      this.undoStack.set(char, []);
    }
    const stack = this.undoStack.get(char)!;
    stack.push(state);
    
    // Limit stack size to 50
    if (stack.length > 50) {
      stack.shift();
    }
    
    // Clear redo stack when new action is made
    this.redoStack.set(char, []);
  }

  private undo(): void {
    const char = this.currentChar;
    const undoStack = this.undoStack.get(char);
    
    if (!undoStack || undoStack.length === 0) {
      this.showToast('Nothing to undo');
      return;
    }
    
    const glyph = this.project.glyphs[char];
    if (!glyph) return;
    
    // Save current state to redo stack
    if (!this.redoStack.has(char)) {
      this.redoStack.set(char, []);
    }
    this.redoStack.get(char)!.push(glyph.pixels.map(row => [...row]));
    
    // Restore previous state
    const prevState = undoStack.pop()!;
    glyph.pixels = prevState;
    
    this.editor?.setGlyph(glyph);
    this.autoSave();
    this.updateCharGrid();
    this.updatePreview();
  }

  private redo(): void {
    const char = this.currentChar;
    const redoStack = this.redoStack.get(char);
    
    if (!redoStack || redoStack.length === 0) {
      this.showToast('Nothing to redo');
      return;
    }
    
    const glyph = this.project.glyphs[char];
    if (!glyph) return;
    
    // Save current state to undo stack
    if (!this.undoStack.has(char)) {
      this.undoStack.set(char, []);
    }
    this.undoStack.get(char)!.push(glyph.pixels.map(row => [...row]));
    
    // Restore redo state
    const nextState = redoStack.pop()!;
    glyph.pixels = nextState;
    
    this.editor?.setGlyph(glyph);
    this.autoSave();
    this.updateCharGrid();
    this.updatePreview();
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
    const useMarkdown = preset === 'markdown';
    const useSyntaxHighlight = preset === 'code';

    // Calculate canvas height based on content
    let totalHeight = 0;
    const lineHeights: number[] = [];
    for (const line of lines) {
      let lineScale = scale;
      if (useMarkdown) {
        if (line.startsWith('# ')) lineScale = scale * 2;
        else if (line.startsWith('## ')) lineScale = scale * 1.5;
        else if (line.startsWith('### ')) lineScale = scale * 1.25;
      }
      const h = (gridHeight + 2) * lineScale;
      lineHeights.push(h);
      totalHeight += h;
    }

    const canvas = document.createElement('canvas');
    canvas.width = maxLineLength * (gridWidth + 1) * scale * (useMarkdown ? 2 : 1);
    canvas.height = totalHeight || (gridHeight + 2) * scale;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let offsetY = 0;
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      let line = lines[lineIdx];
      let lineScale = scale;
      let color = '#eee';
      let offsetX = 0;

      if (useMarkdown) {
        // Parse markdown
        if (line.startsWith('# ')) {
          line = line.slice(2);
          lineScale = scale * 2;
          color = '#c084fc'; // purple for h1
        } else if (line.startsWith('## ')) {
          line = line.slice(3);
          lineScale = scale * 1.5;
          color = '#a78bfa'; // lighter purple for h2
        } else if (line.startsWith('### ')) {
          line = line.slice(4);
          lineScale = scale * 1.25;
          color = '#8b5cf6'; // violet for h3
        } else if (line.startsWith('> ')) {
          line = line.slice(2);
          color = '#6b7280'; // gray for blockquote
          offsetX = gridWidth * scale; // indent
        } else if (line.startsWith('- ')) {
          line = '• ' + line.slice(2);
          color = '#eee';
        }
        
        // Render markdown line with inline formatting
        this.renderMarkdownLine(ctx, line, offsetX, offsetY, lineScale, color);
      } else if (useSyntaxHighlight) {
        // Render with syntax highlighting
        const tokens = tokenizeLine(line);
        let charPos = 0;
        for (const token of tokens) {
          ctx.fillStyle = token.color;
          for (let i = 0; i < token.text.length; i++) {
            const char = token.text[i];
            const glyph = this.project.glyphs[char];
            if (glyph) {
              const charOffsetX = charPos * (gridWidth + 1) * scale;
              for (let row = 0; row < glyph.pixels.length; row++) {
                for (let col = 0; col < glyph.pixels[row].length; col++) {
                  if (glyph.pixels[row][col]) {
                    ctx.fillRect(charOffsetX + col * scale, offsetY + row * scale, scale, scale);
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

          const charOffsetX = i * (gridWidth + 1) * scale;
          for (let row = 0; row < glyph.pixels.length; row++) {
            for (let col = 0; col < glyph.pixels[row].length; col++) {
              if (glyph.pixels[row][col]) {
                ctx.fillRect(charOffsetX + col * scale, offsetY + row * scale, scale, scale);
              }
            }
          }
        }
      }

      offsetY += lineHeights[lineIdx];
    }

    output.appendChild(canvas);
  }

  private renderMarkdownLine(ctx: CanvasRenderingContext2D, line: string, offsetX: number, offsetY: number, lineScale: number, defaultColor: string): void {
    const { gridWidth } = this.project;
    let charPos = 0;
    let i = 0;
    
    while (i < line.length) {
      let color = defaultColor;
      let char = line[i];
      
      // Check for **bold**
      if (line.slice(i, i + 2) === '**') {
        const end = line.indexOf('**', i + 2);
        if (end !== -1) {
          color = '#f9fafb'; // bright white for bold
          for (let j = i + 2; j < end; j++) {
            this.renderChar(ctx, line[j], offsetX + charPos * (gridWidth + 1) * lineScale, offsetY, lineScale, color);
            charPos++;
          }
          i = end + 2;
          continue;
        }
      }
      
      // Check for *italic*
      if (char === '*' && line[i + 1] !== '*') {
        const end = line.indexOf('*', i + 1);
        if (end !== -1) {
          color = '#a5b4fc'; // light blue for italic
          for (let j = i + 1; j < end; j++) {
            this.renderChar(ctx, line[j], offsetX + charPos * (gridWidth + 1) * lineScale, offsetY, lineScale, color);
            charPos++;
          }
          i = end + 1;
          continue;
        }
      }
      
      // Check for `code`
      if (char === '`') {
        const end = line.indexOf('`', i + 1);
        if (end !== -1) {
          color = '#fbbf24'; // amber for code
          for (let j = i + 1; j < end; j++) {
            this.renderChar(ctx, line[j], offsetX + charPos * (gridWidth + 1) * lineScale, offsetY, lineScale, color);
            charPos++;
          }
          i = end + 1;
          continue;
        }
      }
      
      // Regular character
      this.renderChar(ctx, char, offsetX + charPos * (gridWidth + 1) * lineScale, offsetY, lineScale, color);
      charPos++;
      i++;
    }
  }

  private renderChar(ctx: CanvasRenderingContext2D, char: string, x: number, y: number, scale: number, color: string): void {
    const glyph = this.project.glyphs[char];
    if (!glyph) return;
    
    ctx.fillStyle = color;
    for (let row = 0; row < glyph.pixels.length; row++) {
      for (let col = 0; col < glyph.pixels[row].length; col++) {
        if (glyph.pixels[row][col]) {
          ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
        }
      }
    }
  }

  private autoSave(): void {
    saveProject(this.project);
  }

  private openSettingsModal(): void {
    const modal = document.getElementById('settings-modal')!;
    modal.classList.remove('hidden');
    
    // Update form values from current metadata
    const meta = this.getMetadata();
    (document.getElementById('meta-family') as HTMLInputElement).value = meta.family;
    (document.getElementById('meta-version') as HTMLInputElement).value = meta.version;
    (document.getElementById('meta-copyright') as HTMLInputElement).value = meta.copyright;
    (document.getElementById('meta-designer') as HTMLInputElement).value = meta.designer;
    (document.getElementById('meta-designer-url') as HTMLInputElement).value = meta.designerUrl;
    (document.getElementById('meta-description') as HTMLTextAreaElement).value = meta.description;
    (document.getElementById('meta-license') as HTMLInputElement).value = meta.license;
    (document.getElementById('meta-license-url') as HTMLInputElement).value = meta.licenseUrl;
    (document.getElementById('meta-vendor') as HTMLInputElement).value = meta.vendor;
    (document.getElementById('meta-vendor-url') as HTMLInputElement).value = meta.vendorUrl;
  }

  private closeSettingsModal(): void {
    document.getElementById('settings-modal')!.classList.add('hidden');
  }

  private openNewFontModal(): void {
    document.getElementById('new-font-modal')!.classList.remove('hidden');
  }

  private closeNewFontModal(): void {
    document.getElementById('new-font-modal')!.classList.add('hidden');
  }

  private createNewFont(): void {
    const newWidth = parseInt((document.getElementById('new-width') as HTMLInputElement).value, 10);
    const newHeight = parseInt((document.getElementById('new-height') as HTMLInputElement).value, 10);
    const marginTop = parseInt((document.getElementById('margin-top') as HTMLInputElement).value, 10) || 0;
    const marginBottom = parseInt((document.getElementById('margin-bottom') as HTMLInputElement).value, 10) || 0;
    const marginLeft = parseInt((document.getElementById('margin-left') as HTMLInputElement).value, 10) || 0;
    const marginRight = parseInt((document.getElementById('margin-right') as HTMLInputElement).value, 10) || 0;
    
    if (newWidth < 4 || newWidth > 32 || newHeight < 4 || newHeight > 32) {
      this.showToast('Size must be 4-32');
      return;
    }
    
    // Create new empty project with chosen resolution
    this.project = {
      name: 'PixFont',
      version: '1.0',
      gridWidth: newWidth,
      gridHeight: newHeight,
      baseline: Math.floor(newHeight * 0.8),
      letterSpacing: 1,
      glyphs: {},
      metadata: createDefaultMetadata(),
      margins: {
        top: marginTop,
        bottom: marginBottom,
        left: marginLeft,
        right: marginRight,
      },
    };
    
    // Clear undo/redo stacks
    this.undoStack.clear();
    this.redoStack.clear();
    
    saveProject(this.project);
    this.closeNewFontModal();
    this.render();
    this.showToast(`Created ${newWidth}×${newHeight} font`);
  }

  private saveMetadata(): void {
    this.project.metadata = {
      family: (document.getElementById('meta-family') as HTMLInputElement).value || 'PixFont',
      version: (document.getElementById('meta-version') as HTMLInputElement).value || '1.0',
      copyright: (document.getElementById('meta-copyright') as HTMLInputElement).value,
      designer: (document.getElementById('meta-designer') as HTMLInputElement).value,
      designerUrl: (document.getElementById('meta-designer-url') as HTMLInputElement).value,
      description: (document.getElementById('meta-description') as HTMLTextAreaElement).value,
      license: (document.getElementById('meta-license') as HTMLInputElement).value,
      licenseUrl: (document.getElementById('meta-license-url') as HTMLInputElement).value,
      vendor: (document.getElementById('meta-vendor') as HTMLInputElement).value,
      vendorUrl: (document.getElementById('meta-vendor-url') as HTMLInputElement).value,
    };
    
    // Also update project name to match family
    this.project.name = this.project.metadata.family;
    
    this.autoSave();
    this.closeSettingsModal();
    this.showToast('Metadata saved!');
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
