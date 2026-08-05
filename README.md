# Dr. Kornpob Bhirombhakdi — CV Project

Multi-page CV generated from Markdown sources.

**Outputs:**
- `pdf/` — compiled multi-page PDF via Pandoc + XeLaTeX
- `site/` — MkDocs static website

**Source files:** `src/` — one Markdown file per section.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Build

```bash
# PDF
python3 scripts/build_pdf.py

# Website
mkdocs serve   # dev
mkdocs build   # production -> site/
```
