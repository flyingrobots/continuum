# CΩMPUTER LaTeX Book

This directory contains the LaTeX source for the CΩMPUTER book, a computational cosmology exploring graph rewriting, recursive meta-graphs, and multidimensional execution engines.

## Quick Start

```bash
# Build the PDF (runs pdflatex 3 times for references & TOC)
make pdf

# Quick single-pass build (faster, but references may be wrong)
make quick

# Build and open the PDF (macOS)
make view

# Watch for changes and auto-rebuild
make watch
```

## Project Structure

```
latex/
├── computer.tex           # Main document file
├── Makefile              # Build system
├── chapters/             # Individual chapter files
│   ├── introduction.tex
│   ├── chapter-001.tex   # Computation Is the Substrate
│   ├── chapter-015.tex   # Time Travel Debugging
│   └── ...
├── parts/                # Part introduction files
│   ├── part1-intro.tex
│   ├── part4-intro.tex
│   └── ...
├── images/               # SVG wordmarks and graphics
│   ├── CΩMPUTER (4).svg  # Main title wordmark
│   ├── The Universe as Rewrite.svg
│   ├── The Geometry of Thought.svg
│   ├── The Physics of CΩMPUTER.svg
│   ├── Machines That Span Universes.svg
│   ├── The Architecture of CΩMPUTER.svg
│   ├── Beyond Computation.svg
│   └── CΩDEX.svg
├── build/                # Build artifacts (auto-generated)
└── svg-inkscape/         # Auto-generated PDF conversions (auto-generated)
```

## Converting Markdown to LaTeX

Most chapter files are currently placeholders. To convert the original Markdown files:

### Option 1: Automated Conversion (requires pandoc)
```bash
# Convert all Markdown files at once
make convert-all

# Convert a single file
make convert-chapter MD=../003-chapter-001.md OUT=chapters/chapter-001.tex
```

### Option 2: Manual Conversion
Edit the `.tex` files directly. Key LaTeX patterns used in this book:

**CΩMPUTER symbol:**
```latex
C$\Omega$MPUTER  % Use this instead of Unicode Ω
```

**Math symbols:**
```latex
$\approx$  % Instead of ≈
$\rightarrow$ or ->  % Instead of →
```

**Emphasis:**
```latex
\textit{italics}
\textbf{bold}
```

**Quotes:**
```latex
\begin{quote}
Block quote text
\end{quote}
```

**"FOR THE NERDS" boxes:**
```latex
\begin{nerdbox}
Technical sidebar content
\end{nerdbox}
```

**SVG wordmarks:**
```latex
% Title page wordmark
\computerwordmark[8cm]  % Optional width parameter

% Part-specific wordmarks (already added to all parts)
\includesvg[width=7cm]{The Universe as Rewrite.svg}

% Custom wordmark in chapters
\begin{center}
\includesvg[width=5cm]{CΩDEX.svg}
\end{center}
```

## Build Targets

| Command | Description |
|---------|-------------|
| `make` or `make pdf` | Full build with 3 passes |
| `make quick` | Single-pass build |
| `make view` | Build and open PDF |
| `make watch` | Auto-rebuild on changes |
| `make clean` | Remove build artifacts |
| `make distclean` | Remove all generated files |
| `make stats` | Show project statistics |
| `make check-tools` | Verify required tools |
| `make convert-all` | Convert all Markdown files |
| `make help` | Show all available targets |

## Requirements

### Required
- **pdflatex** (included in MacTeX)
  - Install: https://www.tug.org/mactex/
  - Or via Homebrew: `brew install --cask mactex`
- **Inkscape** - For SVG to PDF conversion
  - Install: `brew install inkscape`
  - Required for wordmark graphics

### Optional
- **pandoc** - For Markdown conversion
  - Install: `brew install pandoc`
- **fswatch** - For watch mode
  - Install: `brew install fswatch`

Check what you have installed:
```bash
make check-tools
```

## Document Features

The book is configured with:
- **6" × 9"** page size (standard for technical books)
- **11pt** body text using Latin Modern fonts
- **SVG wordmarks** on title page and all part pages
- Professional chapter/part divisions
- Hyperlinked table of contents
- Custom styling for code blocks and math
- Support for theorems, definitions, and examples
- Headers showing chapter/section names
- Page numbers in footer

### SVG Wordmark Integration

The book uses custom SVG wordmarks created for CΩMPUTER:
- **Title page:** Large CΩMPUTER wordmark (8cm width)
- **Part pages:** Part-specific wordmarks (7cm width)
  - Part I: "The Universe as Rewrite"
  - Part II: "The Geometry of Thought"
  - Part III: "The Physics of CΩMPUTER"
  - Part IV: "Machines That Span Universes"
  - Part V: "The Architecture of CΩMPUTER"
  - Part VI: "Beyond Computation" (commented out)

SVGs are automatically converted to PDF by Inkscape during the build process. The conversions are cached in `svg-inkscape/` for faster subsequent builds.

## Customization

Key customization points in `computer.tex`:

**Page size:**
```latex
\usepackage[
  paperwidth=6in,
  paperheight=9in,
  ...
]{geometry}
```

**Font size:**
```latex
\documentclass[11pt,openany]{book}  % Change 11pt to 10pt or 12pt
```

**Colors:**
```latex
\definecolor{quotegray}{gray}{0.4}
\definecolor{codebg}{gray}{0.95}
```

## Current Status

✅ **Complete:**
- LaTeX document structure
- Introduction chapter (fully converted)
- Chapter 15: Time Travel Debugging (fully converted)
- Part IV introduction (fully converted)
- Build system with Makefile
- PDF generation working

📝 **To Do:**
- Convert remaining chapters from Markdown (chapters 1-14, 16-19)
- Convert remaining part introductions (Parts 1-3)
- Add chapters for Part V (commented out in main file)
- Add chapters for Part VI (commented out in main file)
- Add CΩDEX appendix

## Tips

1. **Iterative conversion:** Convert and test chapters one at a time
2. **Use quick builds:** While editing, `make quick` is faster
3. **Watch mode:** Use `make watch` to see changes in real-time
4. **Unicode issues:** Replace Unicode symbols with LaTeX equivalents
5. **View build logs:** Check `build/computer.log` for detailed errors

## Troubleshooting

**"Unicode character not set up for use with LaTeX"**
- Replace Unicode characters with LaTeX equivalents
- Use `C$\Omega$MPUTER` instead of `CΩMPUTER`
- Use `$\approx$` instead of `≈`

**"File not found"**
- Ensure all chapter files exist in `chapters/`
- Check that filenames use zero-padding (e.g., `chapter-001.tex`)

**"Undefined control sequence"**
- Make sure custom commands are defined in the preamble
- Check that all required packages are included

**Build is slow**
- Use `make quick` for single-pass builds during editing
- Final build needs 3 passes for correct references

## Contributing

When adding new chapters:
1. Create the `.tex` file in `chapters/` or `parts/`
2. Add `\input{...}` line to `computer.tex`
3. Use consistent naming: `chapter-NNN.tex` with zero-padding
4. Test build: `make quick`

---

**CΩMPUTER • JITOS**
© 2025 James Ross • Flying Robots
All Rights Reserved
