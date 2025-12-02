#!/bin/bash

# Script to convert remaining Markdown files to LaTeX
# This creates placeholder files for now

cd "$(dirname "$0")"

# Create placeholder chapters
for i in $(seq -f "%03g" 1 14) 16 17 18 19; do
  if [ ! -f "chapters/chapter-$i.tex" ]; then
    echo "% TODO: Convert from ../$(printf "%03d" $((10#$i + 2)))-chapter-$i.md" > "chapters/chapter-$i.tex"
    echo "\\textit{Chapter content to be converted from Markdown.}" >> "chapters/chapter-$i.tex"
  fi
done

# Create placeholder part intros
for i in 1 2 3; do
  if [ ! -f "parts/part${i}-intro.tex" ]; then
    echo "% TODO: Convert from ../$(printf "%03d" $((i*6 + 1)))-part-${i}-intro.md" > "parts/part${i}-intro.tex"
    echo "\\textit{Part introduction to be converted from Markdown.}" >> "parts/part${i}-intro.tex"
  fi
done

echo "Placeholder files created."
echo "Use pandoc or manual conversion to complete the LaTeX files."
