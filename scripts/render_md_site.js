const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const root = path.resolve('/home/equinox/multiverselib-collectives/cv-project/site');
const outDir = path.resolve('/home/equinox/multiverselib-collectives/cv-project/docs');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Copy images from ims/ into docs/assets/
const assetsDir = path.join(outDir, 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
const imsDir = path.resolve('/home/equinox/multiverselib-collectives/cv-project/ims');
if (fs.existsSync(imsDir)) {
  for (const f of fs.readdirSync(imsDir)) {
    fs.copyFileSync(path.join(imsDir, f), path.join(assetsDir, f));
  }
}

const files = [
  '01-education.md',
  '02-certifications.md',
  '03-employment.md',
  '04-research.md',
  '05-achievements.md',
  '06-skills.md',
];

const stripFrontMatter = (text) => {
  if (text.startsWith('---')) {
    const idx = text.indexOf('---', 3);
    if (idx !== -1) return text.slice(idx + 3).trim();
  }
  return text;
};

const sections = files.map((f) => {
  const raw = stripFrontMatter(fs.readFileSync(path.join(root, f), 'utf8'));
  const html = marked.parse(raw, { gfm: true });
  const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || f;
  return { file: f.replace(/\.md$/, '.html'), title, html };
});

const homeRaw = fs.readFileSync(path.join(root, 'index.md'), 'utf8');
const homeHtml = marked.parse(homeRaw, { gfm: true });

const nav = sections.map((s, i) => `<li><a href="${s.file}">${i + 1}. ${s.title}</a></li>`).join('\n      ');

const pageTemplate = (content, current, isHome) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${current.title} — dr. kornpob bhirombhakdi</title>
<style>
  :root {
    --bg: #06040c;
    --surface: #0c0918;
    --text: #f3e8ff;
    --muted: #6b5f8a;
    --accent: #ff47d1;
    --border: #1a1428;
    --link: #c4b5fd;
    --link-visited: #a78bfa;
    --max: 920px;
    --pad: 28px;
  }
  * { box-sizing: border-box; }
  html, body { background: var(--bg); color: var(--text); }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    font-weight: 400;
    line-height: 1.55;
    margin: 0;
    padding: 0;
  }
  a { color: var(--link); text-decoration: none; }
  a:hover { text-decoration: underline; }
  header {
    border-bottom: 1px solid var(--border);
    padding: 20px var(--pad);
    max-width: var(--max);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .brand {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand img, .theme-logo {
    height: 50px;
    width: auto;
    border: none;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    display: inline-block;
  }
  .meta {
    margin-top: 4px;
    font-size: 13px;
    color: var(--muted);
  }
  .theme-switch {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .theme-switch .theme-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
    margin-right: 4px;
  }
  .theme-switch button {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 4px 8px;
    font-family: inherit;
    font-size: 10px;
    cursor: pointer;
    letter-spacing: 1px;
    transition: all .12s;
  }
  .theme-switch button:hover { border-color: var(--accent); color: var(--text); }
  .theme-switch button.active {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 8px rgba(255,71,209,.18);
  }
  nav {
    max-width: var(--max);
    margin: 0 auto;
    padding: 12px var(--pad);
  }
  ul.nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 16px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul.nav li a {
    font-size: 13px;
    color: var(--muted);
    border-bottom: 1px solid transparent;
    padding-bottom: 1px;
  }
  ul.nav li a:hover { color: var(--text); border-bottom-color: var(--accent); text-decoration: none; }
  main {
    max-width: var(--max);
    margin: 0 auto;
    padding: 22px var(--pad) 64px;
  }
  h1 { font-size: 24px; margin: 0 0 14px; font-weight: 600; }
  h2 { font-size: 18px; margin: 28px 0 12px; color: var(--text); font-weight: 600; }
  h3 { font-size: 15px; margin: 18px 0 8px; color: var(--text); font-weight: 600; }
  hr { border: none; border-top: 1px solid var(--border); margin: 26px 0; }
  p { margin: 10px 0; }
  ul, ol { padding-left: 22px; margin: 10px 0; }
  li { margin: 6px 0; }
  blockquote {
    margin: 14px 0;
    padding: 10px 14px;
    border-left: 3px solid var(--accent);
    background: var(--surface);
    color: var(--muted);
  }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 13px;
    color: #ffd580;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 14px;
  }
  th, td {
    text-align: left;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  th { color: var(--muted); font-weight: 600; }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    border: 1px solid var(--border);
    margin: 10px 0;
    display: block;
  }
  iframe {
    max-width: 100%;
    margin: 12px 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #000;
  }
  .pill {
    display: inline-block;
    background: #1a1d24;
    color: var(--accent);
    padding: 3px 9px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid var(--border);
  }

  .layout {
    display: flex;
    min-height: calc(100vh - 0px);
  }
  .sidebar {
    width: 220px;
    border-right: 1px solid var(--border);
    padding: 22px var(--pad);
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
  }
  .sidebar .brand {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 18px;
    color: var(--text);
  }
  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .sidebar li {
    margin: 6px 0;
  }
  .sidebar a {
    display: block;
    font-size: 13px;
    color: var(--muted);
    padding: 6px 8px;
    border-left: 2px solid transparent;
    text-decoration: none;
  }
  .sidebar a:hover {
    color: var(--text);
    border-left-color: var(--accent);
    text-decoration: none;
  }
  .content-area {
    flex: 1;
    padding: 22px var(--pad) 64px;
    max-width: 100%;
  }
  footer {
    max-width: 100%;
    margin: 0;
    padding: 14px var(--pad) 36px;
    font-size: 12px;
    color: var(--muted);
    border-top: 1px solid var(--border);
  }

  /* ---------- VIBE THEMES ---------- */
  .vibe-zaddy {
    --bg: #1a0f05;
    --surface: #2a1a0a;
    --accent: #ff8c00;
    --border: #3d2a0a;
    --link: #ffc87c;
    --link-visited: #ffb347;
    --muted: #b37a2a;
  }
  .vibe-gdk {
    --bg: #050a14;
    --surface: #0a1428;
    --accent: #4a90d9;
    --border: #1a3a5c;
    --link: #6fb8ff;
    --link-visited: #a0c4ff;
    --muted: #5a7a9a;
  }
  .vibe-dab {
    --bg: #020d08;
    --surface: #071c10;
    --accent: #39ff91;
    --border: #14663d;
    --link: #3cff9a;
    --link-visited: #9df5b7;
    --muted: #4a8a5e;
  }
  .vibe-equinox {
    --bg: #06040c;
    --surface: #0c0918;
    --accent: #ff47d1;
    --border: #1a1428;
    --link: #c4b5fd;
    --link-visited: #a78bfa;
    --muted: #6b5f8a;
  }
</style>
</head>
<body>
  <header>
    <div>
      <div class="brand">dr. kornpob bhirombhakdi</div>
      <div class="meta">${isHome ? 'AI Security Researcher, Educator, and Consultant · bkornpob@gmail.com · ORCID 0000-0003-0136-1281' : 'bkornpob@gmail.com · <a href="https://bkornpob.github.io">bkornpob.github.io</a> · ORCID 0000-0003-0136-1281'}</div>
    </div>
    <div class="theme-switch">
      <a href="https://bkornpob.github.io" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;color:inherit">
        <img src="assets/Logo_multiverselib-collectives.png" alt="multiverselib-collectives" class="theme-logo">
        <span class="theme-label">multiverselib-collectives</span>
      </a>
      <button data-vibe="vibe-zaddy">zaddy</button>
      <button data-vibe="vibe-gdk">gdk</button>
      <button data-vibe="vibe-dab">dab</button>
      <button data-vibe="vibe-equinox">equinox</button>
    </div>
  </header>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">dr. kornpob bhirombhakdi</div>
      <ul>
        <li><a href="landing-page.html">page 0 — Home</a></li>
        ${nav}
      </ul>
    </aside>
    <div class="content-area">
      ${content}
    </div>
  </div>
  <footer>
    <span id="themeStatus"></span>
    <br>
    multiverselib-collectives · built from markdown sources · <a href="landing-page.html">home</a>
  </footer>
  <script>
    const THEMES = ['vibe-zaddy','vibe-gdk','vibe-dab','vibe-equinox'];
    const saved = localStorage.getItem('mlc-vibe');
    if (saved && THEMES.includes(saved)) document.body.classList.add(saved);
    else { document.body.classList.add('vibe-equinox'); }
    document.querySelectorAll('.theme-switch button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.body.classList.remove(...THEMES);
        document.body.classList.add(btn.dataset.vibe);
        localStorage.setItem('mlc-vibe', btn.dataset.vibe);
      });
    });
  </script>
</body>
</html>`;

const frontgateRaw = fs.readFileSync(path.join(root, 'frontgate.html'), 'utf8');

// Extract frontgate styles
const styleMatch = frontgateRaw.match(/<style>([\s\S]*?)<\/style>/);
const frontgateStyles = styleMatch ? styleMatch[1].trim() : '';

// Extract frontgate overlay HTML (div + script)
const overlayMatch = frontgateRaw.match(/(<div id="frontgate">[\s\S]*?<\/div>\s*<script>[\s\S]*?<\/script>)/);
const frontgateOverlay = overlayMatch ? overlayMatch[1].trim() : '';

const homeContent = homeHtml.replace(/<h1[^>]*>.*?<\/h1>/, '') + sections.map(s => `<section>\n<h2><a href="${s.file}">${s.title}</a></h2>\n<div class="meta">${s.file.replace(/\.html$/, '')}</div>\n</section>`).join('\n');

// Build clean landing page without frontgate overlay
const homePage = pageTemplate(homeContent, { title: 'landing-page' }, true)
  .replace('<a href="index.html">Home</a>', '<a href="landing-page.html">Home</a>')
  .replace('<a href="index.html">home</a>', '<a href="landing-page.html">home</a>');

fs.writeFileSync(path.join(outDir, 'landing-page.html'), homePage);

// index.html is the frontgate entry point
const frontgateForIndex = frontgateRaw.replace('window.location.href = \'index.html\'', 'window.location.href = \'landing-page.html\'');
fs.writeFileSync(path.join(outDir, 'index.html'), frontgateForIndex);

// section pages
for (const s of sections) {
  fs.writeFileSync(path.join(outDir, s.file), pageTemplate(`<section>\n${s.html}\n</section>`, s, false));
}

console.log('Rendered', sections.length + 2, 'pages to', outDir);
