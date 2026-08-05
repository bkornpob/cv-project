const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const root = path.resolve('/home/equinox/multiverselib-collectives/cv-project/site');
const outDir = path.resolve('/home/equinox/multiverselib-collectives/cv-project/site/.rendered');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = [
  '01-education.md',
  '02-certifications.md',
  '03-employment.md',
  '04-research.md',
  '05-achievements.md',
  '06-skills.md',
];

const sections = files.map((f) => {
  const raw = fs.readFileSync(path.join(root, f), 'utf8');
  const html = marked.parse(raw, { gfm: true });
  const title = html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1] || f;
  return { file: f.replace(/\.md$/, '.html'), title, html };
});

const homeHtml = marked.parse(fs.readFileSync(path.join(root, 'index.md'), 'utf8'), { gfm: true });

const nav = sections.map((s, i) => `<li><a href="${s.file}">${i + 1}. ${s.title}</a></li>`).join('\n      ');

const pageTemplate = (content, current) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${current.title} — Dr. Kornpob Bhirombhakdi</title>
<style>
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 860px; margin: 0 auto; padding: 24px; color: #1a1a1a; line-height: 1.55; }
  header { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px; margin-bottom: 18px; }
  h1 { font-size: 22px; margin: 0; }
  h2 { font-size: 18px; margin-top: 26px; }
  a { color: #1e40af; }
  ul.nav { display: flex; flex-wrap: wrap; gap: 10px 18px; list-style: none; padding: 0; margin: 0 0 16px; }
  ul.nav li a { font-size: 13px; color: #334155; text-decoration: none; border-bottom: 1px solid transparent; }
  ul.nav li a:hover { border-bottom-color: #1e40af; }
  .meta { font-size: 13px; color: #475569; }
  section { margin-top: 28px; }
  ul { padding-left: 22px; }
  li { margin: 6px 0; }
  hr { border: none; border-top: 1px solid #e5e5e5; margin: 22px 0; }
  .pill { display: inline-block; background: #eef2ff; color: #1e40af; padding: 2px 8px; border-radius: 999px; font-size: 12px; }
</style>
</head>
<body>
  <header>
    <div>
      <h1>Dr. Kornpob Bhirombhakdi</h1>
      <div class="meta">Senior polymath researcher, educator, and consultant · bkornpob@gmail.com · ORCID 0000-0003-0136-1281</div>
    </div>
  </header>
  <ul class="nav">
    <li><a href="index.html">Home</a></li>
    ${nav}
  </ul>
  ${content}
  <footer style="margin-top: 40px; padding-top: 14px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #64748b;">
    Built from Markdown sources · <a href="index.html">Home</a>
  </footer>
</body>
</html>`;

// index
const indexContent = homeHtml.replace(/<h1[^>]*>.*?<\/h1>/, '') + sections.map(s => `<section>\n<h2><a href="${s.file}">${s.title}</a></h2>\n<div class="meta">${s.file.replace(/\.html$/, '')}</div>\n</section>`).join('\n');
fs.writeFileSync(path.join(outDir, 'index.html'), pageTemplate(indexContent, { title: 'Home' }));

// sections
for (const s of sections) {
  fs.writeFileSync(path.join(outDir, s.file), pageTemplate(`<section>\n${s.html}\n</section>`, s));
}

console.log('Rendered', sections.length + 1, 'pages to', outDir);
