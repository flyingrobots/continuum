#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def clean_unicode(text):
    """Replace problematic Unicode characters with LaTeX equivalents"""

    # Replace smart quotes with straight quotes
    text = text.replace(''', "'")
    text = text.replace(''', "'")
    text = text.replace('"', '"')
    text = text.replace('"', '"')

    # Remove or replace special Unicode characters
    text = re.sub(r'[─│┌┐└┘├┤┬┴┼╱╲╳⎯⎼]', ' ', text)
    text = re.sub(r'[⸻—–]', '---', text)
    text = re.sub(r'[●•⚫]', r'\\textbullet{}', text)
    text = re.sub(r'[👉✨🔥💡⚡🎯🚀💥🌟🎉]', '', text)

    # Remove any other high Unicode characters that might cause issues
    text = re.sub(r'[\u2500-\u257F]', ' ', text)  # Box drawing
    text = re.sub(r'[\u2580-\u259F]', ' ', text)  # Block elements
    text = re.sub(r'[\U0001F300-\U0001F9FF]', '', text)  # Emojis

    return text

def main():
    latex_dir = Path(__file__).parent

    # Process all .tex files in chapters and parts
    for pattern in ['chapters/*.tex', 'parts/*.tex']:
        for tex_file in latex_dir.glob(pattern):
            print(f"Cleaning {tex_file.name}...")
            try:
                content = tex_file.read_text(encoding='utf-8', errors='replace')
                cleaned = clean_unicode(content)
                if content != cleaned:
                    tex_file.write_text(cleaned, encoding='utf-8')
                    print(f"  ✓ Cleaned")
                else:
                    print(f"  - No changes needed")
            except Exception as e:
                print(f"  ✗ Error: {e}")

    print("Done!")

if __name__ == '__main__':
    main()
