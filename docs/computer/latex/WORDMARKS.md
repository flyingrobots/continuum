# SVG Wordmark Integration Guide

## Overview

The CΩMPUTER book now includes professional SVG wordmarks throughout:

✅ **Title Page** - Large CΩMPUTER logo (8cm)
✅ **Part I** - "The Universe as Rewrite" (7cm)
✅ **Part II** - "The Geometry of Thought" (7cm)
✅ **Part III** - "The Physics of CΩMPUTER" (7cm)
✅ **Part IV** - "Machines That Span Universes" (7cm)
✅ **Part V** - "The Architecture of CΩMPUTER" (7cm)
⏸️ **Part VI** - "Beyond Computation" (ready but commented out)

## How It Works

### Automatic SVG to PDF Conversion

The LaTeX `svg` package automatically converts SVG files to PDF using Inkscape:

1. **First build:** Inkscape converts each SVG → PDF (slower)
2. **Subsequent builds:** Uses cached PDFs (faster)
3. **Cache location:** `svg-inkscape/` directory

### File Locations

```
images/
├── CΩMPUTER (4).svg              ← Main title wordmark
├── The Universe as Rewrite.svg   ← Part I
├── The Geometry of Thought.svg   ← Part II
├── The Physics of CΩMPUTER.svg   ← Part III
├── Machines That Span Universes.svg ← Part IV
├── The Architecture of CΩMPUTER.svg ← Part V
├── Beyond Computation.svg        ← Part VI (future)
├── CΩDEX.svg                     ← Appendix wordmark
├── PART I.svg through PART VI.svg ← Alternate versions
└── AIΩN (11).svg, AIΩN (12).svg  ← Additional wordmarks
```

## LaTeX Commands

### Pre-defined Commands

```latex
% Main CΩMPUTER wordmark
\computerwordmark[8cm]  % Default: 4cm width

% CΩDEX wordmark
\codexwordmark[3cm]     % Default: 3cm width

% Generic part wordmark helper
\partwordmark[5cm]{filename.svg}
```

### Direct SVG Inclusion

```latex
% Basic inclusion
\includesvg{filename.svg}

% With width
\includesvg[width=5cm]{filename.svg}

% With height
\includesvg[height=3cm]{filename.svg}

% Centered
\begin{center}
\includesvg[width=6cm]{filename.svg}
\end{center}
```

## Adding Wordmarks to Chapters

If you want to add a wordmark to a specific chapter, edit the chapter file:

```latex
% At the top of chapters/chapter-015.tex (for example)
\begin{center}
\vspace{0.5cm}
\includesvg[width=5cm]{CΩDEX.svg}
\vspace{0.5cm}
\end{center}

% Your chapter content continues here...
```

Or use the custom command defined in `computer.tex`:

```latex
\chapterwithwordmark{Chapter Title}{wordmark-filename.svg}
\input{chapters/chapter-015}
```

## Current Implementation

### Title Page (computer.tex:162)
```latex
% Main wordmark
\computerwordmark[8cm]
\vspace{1.5cm}
```

### Part Pages (computer.tex:217-315)
Each part includes:
```latex
\part{Part Name}
\begin{center}
\vspace{-2cm}
\includesvg[width=7cm]{Part Wordmark.svg}
\end{center}
\vspace{1cm}
\input{parts/partN-intro}
```

## Customization

### Adjusting Wordmark Size

Edit the width parameter:
```latex
% Smaller
\includesvg[width=4cm]{filename.svg}

% Larger
\includesvg[width=10cm]{filename.svg}
```

### Adjusting Spacing

Change the `\vspace` values:
```latex
% More space above
\vspace{3cm}
\includesvg[width=7cm]{filename.svg}

% Less space below
\vspace{0.5cm}
```

### Changing Wordmarks

To use a different SVG:
1. Add your SVG file to `images/`
2. Update the `\includesvg` command:
   ```latex
   \includesvg[width=7cm]{new-wordmark.svg}
   ```
3. Rebuild: `make pdf`

## Troubleshooting

### "shell escape not enabled"
**Solution:** The Makefile already includes `-shell-escape`. If you're building manually:
```bash
pdflatex -shell-escape computer.tex
```

### "Inkscape not found"
**Solution:** Install Inkscape:
```bash
brew install inkscape
```

### "File not found" errors
**Solution:** Ensure SVG files are in the `images/` directory and the filename matches exactly (case-sensitive).

### Slow first build
**Normal:** Inkscape conversion takes time on first build. Subsequent builds use cached PDFs.

### Force reconversion
Delete the cache and rebuild:
```bash
rm -rf svg-inkscape/
make pdf
```

## Available Wordmarks

All SVG files from `docs/computer/svg/` have been copied to `images/`:

| File | Purpose | Used Where |
|------|---------|------------|
| CΩMPUTER (4).svg | Main title logo | Title page |
| The Universe as Rewrite.svg | Part I header | Part I page |
| The Geometry of Thought.svg | Part II header | Part II page |
| The Physics of CΩMPUTER.svg | Part III header | Part III page |
| Machines That Span Universes.svg | Part IV header | Part IV page |
| The Architecture of CΩMPUTER.svg | Part V header | Part V page |
| Beyond Computation.svg | Part VI header | Part VI (commented) |
| CΩDEX.svg | Appendix logo | Available |
| PART I-VI.svg | Alternate part markers | Available |
| AIΩN (11-12).svg | Additional branding | Available |

## Build Configuration

The following settings in `computer.tex` enable SVG support:

```latex
% SVG support (requires Inkscape installed)
\usepackage{svg}
\svgpath{{images/}}

% Custom wordmark commands
\newcommand{\computerwordmark}[1][4cm]{\includesvg[width=#1]{CΩMPUTER (4).svg}}
\newcommand{\codexwordmark}[1][3cm]{\includesvg[width=#1]{CΩDEX.svg}}
\newcommand{\partwordmark}[2][5cm]{\includesvg[width=#1]{#2}}
```

The Makefile includes the required `-shell-escape` flag:
```makefile
LATEX_FLAGS = -interaction=nonstopmode -halt-on-error -shell-escape -output-directory=$(BUILD_DIR)
```

## Next Steps

You can now:
- ✅ Build the PDF with wordmarks: `make pdf`
- ✅ View the result: `make view`
- ✅ Add wordmarks to individual chapters (if desired)
- ✅ Customize wordmark sizes and spacing
- ✅ Swap out wordmarks for alternate versions

All wordmarks are in place and the book is ready to build!

---

**CΩMPUTER • JITOS**
© 2025 James Ross • Flying Robots
