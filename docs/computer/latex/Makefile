# =============================================================================
# CΩMPUTER LaTeX Build System
# =============================================================================

# Project configuration
PROJECT = computer
MAIN_TEX = $(PROJECT).tex
OUTPUT_PDF = $(PROJECT).pdf

# Build directories
BUILD_DIR = build
CHAPTERS_DIR = chapters
PARTS_DIR = parts

# LaTeX compiler configuration
LATEX = pdflatex
LATEX_FLAGS = -interaction=nonstopmode -halt-on-error -shell-escape -output-directory=$(BUILD_DIR)
BIBTEX = bibtex
MAKEINDEX = makeindex

# Additional tools
PANDOC = pandoc
PANDOC_FLAGS = --from=markdown --to=latex --standalone

# Color output
COLOR_RESET = \033[0m
COLOR_BOLD = \033[1m
COLOR_GREEN = \033[32m
COLOR_YELLOW = \033[33m
COLOR_BLUE = \033[34m

# =============================================================================
# Main Targets
# =============================================================================

.PHONY: all clean distclean pdf view watch help init convert

# Default target
all: pdf

# Build the PDF
pdf: init
	@echo "$(COLOR_BOLD)$(COLOR_BLUE)Building $(OUTPUT_PDF)...$(COLOR_RESET)"
	@$(LATEX) $(LATEX_FLAGS) $(MAIN_TEX)
	@echo "$(COLOR_YELLOW)Running second pass for references...$(COLOR_RESET)"
	@$(LATEX) $(LATEX_FLAGS) $(MAIN_TEX) > /dev/null
	@echo "$(COLOR_YELLOW)Running third pass for TOC...$(COLOR_RESET)"
	@$(LATEX) $(LATEX_FLAGS) $(MAIN_TEX) > /dev/null
	@cp $(BUILD_DIR)/$(OUTPUT_PDF) .
	@echo "$(COLOR_BOLD)$(COLOR_GREEN)✓ Build complete: $(OUTPUT_PDF)$(COLOR_RESET)"

# Initialize build directory
init:
	@mkdir -p $(BUILD_DIR)

# Clean build artifacts but keep PDF
clean:
	@echo "$(COLOR_YELLOW)Cleaning build artifacts...$(COLOR_RESET)"
	@rm -rf $(BUILD_DIR)/*.aux \
	        $(BUILD_DIR)/*.log \
	        $(BUILD_DIR)/*.out \
	        $(BUILD_DIR)/*.toc \
	        $(BUILD_DIR)/*.lof \
	        $(BUILD_DIR)/*.lot \
	        $(BUILD_DIR)/*.bbl \
	        $(BUILD_DIR)/*.blg \
	        $(BUILD_DIR)/*.idx \
	        $(BUILD_DIR)/*.ind \
	        $(BUILD_DIR)/*.ilg \
	        $(BUILD_DIR)/*.fls \
	        $(BUILD_DIR)/*.fdb_latexmk \
	        $(BUILD_DIR)/*.synctex.gz
	@echo "$(COLOR_GREEN)✓ Cleaned$(COLOR_RESET)"

# Complete clean including PDF
distclean: clean
	@echo "$(COLOR_YELLOW)Removing all generated files...$(COLOR_RESET)"
	@rm -rf $(BUILD_DIR)
	@rm -f $(OUTPUT_PDF)
	@echo "$(COLOR_GREEN)✓ Complete clean$(COLOR_RESET)"

# View the PDF (macOS)
view: pdf
	@echo "$(COLOR_BLUE)Opening $(OUTPUT_PDF)...$(COLOR_RESET)"
	@open $(OUTPUT_PDF)

# Watch for changes and rebuild (requires fswatch)
watch:
	@echo "$(COLOR_BOLD)$(COLOR_BLUE)Watching for changes...$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)Press Ctrl+C to stop$(COLOR_RESET)"
	@while true; do \
		$(MAKE) --no-print-directory pdf; \
		echo "$(COLOR_YELLOW)Waiting for changes...$(COLOR_RESET)"; \
		fswatch -1 $(MAIN_TEX) $(CHAPTERS_DIR)/*.tex $(PARTS_DIR)/*.tex 2>/dev/null || \
		(echo "$(COLOR_YELLOW)fswatch not found, install with: brew install fswatch$(COLOR_RESET)" && exit 1); \
	done

# =============================================================================
# Conversion Targets
# =============================================================================

# Convert a single markdown file to LaTeX
# Usage: make convert-chapter MD=../003-chapter-001.md OUT=chapters/chapter-001.tex
convert-chapter:
	@if [ -z "$(MD)" ] || [ -z "$(OUT)" ]; then \
		echo "$(COLOR_YELLOW)Usage: make convert-chapter MD=<input.md> OUT=<output.tex>$(COLOR_RESET)"; \
		exit 1; \
	fi
	@echo "$(COLOR_BLUE)Converting $(MD) -> $(OUT)...$(COLOR_RESET)"
	@$(PANDOC) $(PANDOC_FLAGS) $(MD) -o $(OUT)
	@echo "$(COLOR_GREEN)✓ Converted$(COLOR_RESET)"

# Batch convert all markdown chapters (requires pandoc)
convert-all:
	@echo "$(COLOR_BOLD)$(COLOR_BLUE)Converting all Markdown files to LaTeX...$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)This is a semi-automated process. Manual cleanup may be needed.$(COLOR_RESET)"
	@for md in ../0*.md; do \
		base=$$(basename "$$md" .md); \
		if [[ "$$base" =~ ^002-introduction$$ ]]; then \
			out="$(CHAPTERS_DIR)/introduction.tex"; \
		elif [[ "$$base" =~ ^[0-9]+-chapter-([0-9]+)$$ ]]; then \
			num=$${BASH_REMATCH[1]}; \
			out="$(CHAPTERS_DIR)/chapter-$$num.tex"; \
		elif [[ "$$base" =~ part-[0-9]+-intro ]]; then \
			out="$(PARTS_DIR)/$${base#*-}.tex"; \
		else \
			continue; \
		fi; \
		echo "Converting $$md -> $$out"; \
		$(PANDOC) $(PANDOC_FLAGS) "$$md" -o "$$out"; \
	done
	@echo "$(COLOR_GREEN)✓ Conversion complete$(COLOR_RESET)"
	@echo "$(COLOR_YELLOW)⚠ Please review converted files for formatting$(COLOR_RESET)"

# =============================================================================
# Development Targets
# =============================================================================

# Quick build (single pass, faster but may have wrong references)
quick: init
	@echo "$(COLOR_BLUE)Quick build (single pass)...$(COLOR_RESET)"
	@$(LATEX) $(LATEX_FLAGS) $(MAIN_TEX)
	@cp $(BUILD_DIR)/$(OUTPUT_PDF) .
	@echo "$(COLOR_GREEN)✓ Quick build complete$(COLOR_RESET)"

# Show build statistics
stats:
	@echo "$(COLOR_BOLD)Project Statistics:$(COLOR_RESET)"
	@echo "Main file: $(MAIN_TEX)"
	@echo "Chapters:  $$(ls -1 $(CHAPTERS_DIR)/*.tex 2>/dev/null | wc -l | tr -d ' ')"
	@echo "Parts:     $$(ls -1 $(PARTS_DIR)/*.tex 2>/dev/null | wc -l | tr -d ' ')"
	@if [ -f $(OUTPUT_PDF) ]; then \
		echo "PDF size:  $$(du -h $(OUTPUT_PDF) | cut -f1)"; \
	fi

# Check for required tools
check-tools:
	@echo "$(COLOR_BOLD)Checking for required tools...$(COLOR_RESET)"
	@command -v $(LATEX) >/dev/null 2>&1 && \
		echo "$(COLOR_GREEN)✓ pdflatex found$(COLOR_RESET)" || \
		echo "$(COLOR_YELLOW)✗ pdflatex not found (install MacTeX)$(COLOR_RESET)"
	@command -v inkscape >/dev/null 2>&1 && \
		echo "$(COLOR_GREEN)✓ inkscape found$(COLOR_RESET)" || \
		echo "$(COLOR_YELLOW)✗ inkscape not found (required for SVG wordmarks: brew install inkscape)$(COLOR_RESET)"
	@command -v $(PANDOC) >/dev/null 2>&1 && \
		echo "$(COLOR_GREEN)✓ pandoc found$(COLOR_RESET)" || \
		echo "$(COLOR_YELLOW)✗ pandoc not found (optional: brew install pandoc)$(COLOR_RESET)"
	@command -v fswatch >/dev/null 2>&1 && \
		echo "$(COLOR_GREEN)✓ fswatch found$(COLOR_RESET)" || \
		echo "$(COLOR_YELLOW)✗ fswatch not found (optional, for watch target)$(COLOR_RESET)"

# =============================================================================
# Help
# =============================================================================

help:
	@echo "$(COLOR_BOLD)CΩMPUTER LaTeX Build System$(COLOR_RESET)"
	@echo ""
	@echo "$(COLOR_BOLD)Main targets:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make$(COLOR_RESET) or $(COLOR_GREEN)make all$(COLOR_RESET)     - Build the PDF (default)"
	@echo "  $(COLOR_GREEN)make pdf$(COLOR_RESET)              - Build the PDF with multiple passes"
	@echo "  $(COLOR_GREEN)make quick$(COLOR_RESET)            - Quick single-pass build"
	@echo "  $(COLOR_GREEN)make view$(COLOR_RESET)             - Build and open the PDF"
	@echo "  $(COLOR_GREEN)make clean$(COLOR_RESET)            - Remove build artifacts"
	@echo "  $(COLOR_GREEN)make distclean$(COLOR_RESET)        - Remove all generated files"
	@echo ""
	@echo "$(COLOR_BOLD)Development targets:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make watch$(COLOR_RESET)            - Watch for changes and rebuild"
	@echo "  $(COLOR_GREEN)make stats$(COLOR_RESET)            - Show project statistics"
	@echo "  $(COLOR_GREEN)make check-tools$(COLOR_RESET)      - Check for required tools"
	@echo ""
	@echo "$(COLOR_BOLD)Conversion targets:$(COLOR_RESET)"
	@echo "  $(COLOR_GREEN)make convert-all$(COLOR_RESET)      - Convert all Markdown files to LaTeX"
	@echo "  $(COLOR_GREEN)make convert-chapter$(COLOR_RESET)  - Convert single file (set MD= and OUT=)"
	@echo ""
	@echo "$(COLOR_BOLD)Examples:$(COLOR_RESET)"
	@echo "  make pdf && make view"
	@echo "  make convert-chapter MD=../003-chapter-001.md OUT=chapters/chapter-001.tex"
	@echo ""
	@echo "$(COLOR_BOLD)Installation requirements:$(COLOR_RESET)"
	@echo "  - MacTeX (for pdflatex): https://www.tug.org/mactex/"
	@echo "  - Inkscape (for SVG wordmarks): brew install inkscape"
	@echo "  - pandoc (optional): brew install pandoc"
	@echo "  - fswatch (optional): brew install fswatch"
