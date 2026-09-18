# Dr. Kornpob Bhirombhakdi — CV Project

Multi-page CV / personal site with custom Node.js renderer.

**Source of truth:** `site/*.md` → `docs/` via `node scripts/render_md_site.js`

**PDF source:** `pdf/cv.md` → `pdf/cv.pdf` via Pandoc + XeLaTeX

**Note:** These are two independent build pipelines. Editing `pdf/cv.md` updates only the PDF; editing `site/*.md` updates only the HTML site. Re-render each separately.

## Setup

```bash
npm install
```

## Build Site

```bash
node scripts/render_md_site.js
```

## Build PDF

```bash
pandoc pdf/cv.md -o pdf/cv.pdf --pdf-engine=xelatex -V geometry:margin=1.5cm -V mainfont="DejaVu Serif" -V sansfont="DejaVu Sans" -V fontsize=10pt -V linestretch=1.15
```

## Serve

```bash
cd docs && python3 -m http.server 8090
```
