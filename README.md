# Dr. Kornpob Bhirombhakdi — CV Project

Multi-page CV / personal site with custom Node.js renderer.

**Source of truth:** `site/*.md` → `docs/` via `node scripts/render_md_site.js`

## Setup

```bash
npm install
```

## Build

```bash
node scripts/render_md_site.js
```

## Serve

```bash
cd docs && python3 -m http.server 8090
```
