# PixFonts — Specifications

## Overview

PixFonts is a single-page web application for creating pixel-art style fonts. Users design characters on a pixel grid, and the app exports them as vector TTF fonts where each "pixel" becomes a vector square — ensuring the font scales perfectly at any size.

---

## Architecture

### Tech Stack

- **Frontend**: Vanilla TypeScript + Vite
- **Styling**: CSS (no framework)
- **Font Generation**: [opentype.js](https://opentype.js.org/) for TTF export
- **Deployment**: Static site (GitHub Pages, Vercel, or Netlify)

### Why Vanilla?

- Zero dependencies for the UI = fast, lightweight, easy to maintain
- opentype.js handles the complex font generation
- No build complexity beyond Vite

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] PixFonts          [Save] [Load] [Export TTF] [⚙️]   │  ← Menu Bar
├───────────────────────────────────┬─────────────────────────┤
│                                   │                         │
│                                   │   A B C D E F G H I J   │
│        ┌───────────────┐          │   K L M N O P Q R S T   │
│        │ ░ ░ █ █ ░ ░   │          │   U V W X Y Z           │
│        │ ░ █ ░ ░ █ ░   │          │   a b c d e f g h i j   │
│        │ █ █ █ █ █ █   │  ←Editor │   k l m n o p q r s t   │  ← Character Grid
│        │ █ ░ ░ ░ ░ █   │          │   u v w x y z           │
│        │ █ ░ ░ ░ ░ █   │          │   0 1 2 3 4 5 6 7 8 9   │
│        └───────────────┘          │   ! @ # $ % ...         │
│         [◀ A ▶] 8x10              │                         │
│                                   │                         │
├───────────────────────────────────┴─────────────────────────┤
│  Preview: "The quick brown fox jumps over the lazy dog"     │  ← Live Preview
│  ████ █ █ ███   ███ █ █ █ ███ █ █   ████ ███ ███ █ █ █ █    │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Menu Bar

| Element | Function |
|---------|----------|
| **Save** | Save project to localStorage (JSON) |
| **Load** | Load project from localStorage or file |
| **Export TTF** | Generate and download .ttf file |
| **Settings ⚙️** | Open settings modal |

#### Settings Modal

- **Font Name**: Name for the exported font (default: "PixFont")
- **Grid Resolution**: Width × Height per character (default: 8×10)
- **Character Set**: Checkboxes for A-Z, a-z, 0-9, punctuation, extended
- **Baseline**: Row number for text baseline (default: row 8)
- **Letter Spacing**: Extra space between characters (default: 1 unit)

### 2. Character Editor

The main editing area where users design individual glyphs.

**Features:**
- Pixel grid (resolution from settings)
- Click to toggle pixel on/off
- Drag to paint multiple pixels
- Right-click drag to erase
- Current character indicator with prev/next navigation
- Keyboard shortcuts: ← → to navigate, arrow keys with shift to move glyph

**Visual:**
- Grid lines visible for alignment
- Active pixels filled with primary color
- Hover state on cells
- Optional: guidelines for baseline, x-height, cap-height

### 3. Character Grid

A visual overview of all characters in the current font.

**Features:**
- Thumbnail view of each glyph
- Click to select and edit
- Visual indicator for:
  - Empty (not designed yet)
  - Designed (has pixels)
  - Currently selected
- Scrollable if many characters
- Supports: A-Z, a-z, 0-9, common punctuation

**Characters to support (v1):**
```
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
0123456789
.,;:!?'"()-+=/\@#$%&*[]{}|<>~`^_
 (space)
```

### 4. Live Preview

Real-time preview of the font with sample text.

**Features:**
- Editable sample text input
- Renders using the current glyph designs
- Updates live as user edits
- Font size slider (to test different sizes)
- Shows how the font looks at actual use

---

## Data Model

### Project (JSON)

```typescript
interface PixFontProject {
  name: string;               // Font family name
  version: string;            // Project format version
  gridWidth: number;          // Pixels per character (width)
  gridHeight: number;         // Pixels per character (height)
  baseline: number;           // Row index for baseline (0-indexed from top)
  letterSpacing: number;      // Extra units between characters
  glyphs: Record<string, Glyph>;
}

interface Glyph {
  char: string;               // The character (e.g., "A")
  codePoint: number;          // Unicode code point
  pixels: boolean[][];        // 2D array [row][col], true = filled
  width?: number;             // Optional: custom width (for proportional)
}
```

### Storage

- **localStorage**: Auto-save current project as `pixfonts_project`
- **File export/import**: JSON file for project backup/sharing

---

## TTF Export Process

### Pixel → Vector Conversion

Each active pixel becomes a vector square path:

```
Pixel at (x, y) with pixel size S:
→ Rectangle path from (x*S, y*S) to ((x+1)*S, (y+1)*S)
```

### Using opentype.js

1. Create a new `opentype.Font` with metadata (name, unitsPerEm, ascender, descender)
2. For each character:
   - Create a new `opentype.Path`
   - For each active pixel, add a rectangle to the path
   - Optimize: merge adjacent rectangles into larger shapes (optional)
   - Create `opentype.Glyph` with the path
3. Add all glyphs to font
4. Export as ArrayBuffer → download as .ttf

### Font Metrics

- **unitsPerEm**: gridHeight × pixelSize (e.g., 10 × 100 = 1000)
- **ascender**: (gridHeight - baseline) × pixelSize
- **descender**: -baseline × pixelSize (negative, below baseline)
- **advanceWidth**: (gridWidth + letterSpacing) × pixelSize

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Previous/next character |
| `Ctrl+S` | Save project |
| `Ctrl+E` | Export TTF |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Shift+Arrow` | Move entire glyph |
| `Delete` | Clear current glyph |

---

## Implementation Phases

### Phase 1: Core Editor ✨
- [ ] Project setup (Vite + TypeScript)
- [ ] Basic pixel grid editor
- [ ] Character navigation
- [ ] Save/load to localStorage

### Phase 2: Character Grid
- [ ] Thumbnail view of all glyphs
- [ ] Click to select
- [ ] Visual states (empty/designed/selected)

### Phase 3: Preview
- [ ] Live text preview
- [ ] Custom sample text
- [ ] Size adjustment

### Phase 4: Export
- [ ] opentype.js integration
- [ ] Pixel → path conversion
- [ ] TTF download

### Phase 5: Polish
- [ ] Undo/redo
- [ ] Keyboard shortcuts
- [ ] Settings modal
- [ ] Mobile responsiveness (nice-to-have)
- [ ] Import existing project file

---

## Non-Goals (v1)

- Multi-color fonts
- Variable fonts
- OTF export (TTF only)
- Kerning pairs editor
- Bezier curve editing (this is a *pixel* font editor)
- Backend/accounts/cloud save
- Path optimization (merging adjacent pixels into complex shapes) — future nice-to-have

---

## Open Questions

1. **Proportional vs Monospace?**
   - v1: Monospace (fixed width for all characters)
   - Future: Allow per-character width adjustment

2. **Path optimization?**
   - Simple: each pixel = one rectangle
   - Optimized: merge adjacent pixels into fewer rectangles
   - Recommendation: Start simple, optimize later if needed

3. **Unicode support?**
   - v1: Basic Latin (ASCII 32-126)
   - Future: Extended Latin, accented characters

---

## References

- [opentype.js Documentation](https://opentype.js.org/)
- [FontForge](https://fontforge.org/) — desktop alternative
- [Bits'N'Picas](https://github.com/kreativekorp/bitsnpicas) — inspiration
- [Google Fonts Knowledge](https://fonts.google.com/knowledge)
