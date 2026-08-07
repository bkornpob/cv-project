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
    --bg: #0b0c10;
    --surface: #111318;
    --text: #e6e6e6;
    --muted: #9aa3af;
    --accent: #c9a227;
    --border: #1f232b;
    --link: #7fb3ff;
    --link-visited: #b4a7d6;
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
    padding: 24px var(--pad);
    max-width: var(--max);
    margin: 0 auto;
  }
  .brand {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: 0.2px;
  }
  .meta {
    margin-top: 6px;
    font-size: 13px;
    color: var(--muted);
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
  footer {
    max-width: var(--max);
    margin: 0 auto;
    padding: 14px var(--pad) 36px;
    font-size: 12px;
    color: var(--muted);
    border-top: 1px solid var(--border);
  }
</style>
</head>
<body>
  <header>
    <div class="brand">dr. kornpob bhirombhakdi</div>
    <div class="meta">${isHome ? 'AI Security Researcher, Educator, and Consultant · bkornpob@gmail.com · ORCID 0000-0003-0136-1281' : 'bkornpob@gmail.com · <a href="https://bkornpob.github.io">bkornpob.github.io</a> · ORCID 0000-0003-0136-1281'}</div>
  </header>
  <nav>
    <ul class="nav">
      <li><a href="landing-page.html">Home</a></li>
      ${nav}
    </ul>
  </nav>
  <main>
    ${content}
  </main>
  <footer>
    multiverselib-collectives · built from markdown sources · <a href="index.html">home</a>
  </footer>
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
