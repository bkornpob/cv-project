#!/usr/bin/env python3
"""Build multi-page PDF CV from Markdown sources via Pandoc + XeLaTeX."""

import subprocess
import sys
from pathlib import Path

SRC = Path(__file__).parent.parent / "site"
OUT = Path(__file__).parent.parent / "pdf"
TEX_TEMPLATE = Path(__file__).parent / "cv-template.tex"

OUT.mkdir(exist_ok=True)

# Section order — matches the website
sections = [
    "01-education.md",
    "02-certifications.md",
    "03-employment.md",
    "04-research.md",
    "05-achievements.md",
    "06-skills.md",
]

# Build a single combined Markdown for Pandoc
combined = []
combined.append("# Dr. Kornpob Bhirombhakdi\n\n")
combined.append("**Senior polymath researcher, educator, and consultant**  \n")
combined.append("bkornpob@gmail.com · [bkornpob.github.io](https://bkornpob.github.io)  \n")
combined.append("ORCID: [0000-0003-0136-1281](https://orcid.org/0000-0003-0136-1281)\n\n---\n\n")

for fname in sections:
    path = SRC / fname
    content = path.read_text()
    # Strip YAML front matter if present
    if content.startswith("---"):
        content = content.split("---", 2)[2].strip()
    combined.append(content)
    combined.append("\n\n\\clearpage\n\n")

# Write intermediate markdown
combined_md = OUT / "cv-combined.md"
combined_md.write_text("\n".join(combined))

# Run Pandoc with XeLaTeX (supports Thai + modern fonts)
cmd = [
    "pandoc",
    str(combined_md),
    "-o", str(OUT / "cv.pdf"),
    "--pdf-engine=xelatex",
    "-V", "geometry:margin=0.6in",
    "-V", "fontsize=10pt",
    "-V", "colorlinks=true",
    "-V", "linkcolor=blue",
    "-V", "urlcolor=blue",
    "--toc",
    "--toc-depth=1",
]

if TEX_TEMPLATE.exists():
    cmd += ["--template", str(TEX_TEMPLATE)]

print(f"Building PDF: {OUT / 'cv.pdf'}")
result = subprocess.run(cmd, capture_output=True, text=True)

if result.returncode != 0:
    print("STDERR:", result.stderr, file=sys.stderr)
    sys.exit(1)

print(f"Done → {OUT / 'cv.pdf'}")
print(f"Size: {(OUT / 'cv.pdf').stat().st_size / 1024:.1f} KB")
