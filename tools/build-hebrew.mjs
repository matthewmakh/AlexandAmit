// Generates the Hebrew pages in public/he/ from the English pages in public/.
// English markup stays the single source of truth; every Hebrew string lives in
// translations.he.json. Re-run after editing an English page:
//
//     node tools/build-hebrew.mjs
//
// Zero dependencies, to match the rest of the project.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'public');
const OUT = path.join(SRC, 'he');

const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/translations.he.json'), 'utf8'));

const PAGES = ['home', 'events', 'travel', 'gallery', 'newlywed-fund', '404'];

// English route -> Hebrew route
const ROUTES = {
  '/': '/he',
  '/home': '/he',
  '/events': '/he/events',
  '/travel': '/he/travel',
  '/gallery': '/he/gallery',
  '/newlywed-fund': '/he/newlywed-fund',
};

const HEBREW_LABEL = 'עברית'; // "Ivrit"

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };
const unescapeHtml = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m]);
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Strings that are deliberately never translated: brand names, machine-readable
// meta values, an email address, and the English label on the switch itself.
const KEEP_AS_IS = new Set([
  'EN',
  'Zelle',
  'amitshushan16@gmail.com',
  'website',
  'noindex',
  'width=device-width, initial-scale=1',
]);

const missing = new Set();

function translate(raw) {
  const plain = unescapeHtml(raw).trim();
  if (!plain || !/[A-Za-z]/.test(plain)) return null;
  if (KEEP_AS_IS.has(plain) || plain.startsWith('/assets/') || /^@@SCRIPT\d+@@$/.test(plain)) return null;
  const hit = T[plain];
  if (hit === undefined) {
    missing.add(plain);
    return null;
  }
  return hit;
}

function build(page) {
  let s = fs.readFileSync(path.join(SRC, `${page}.html`), 'utf8');

  // --- document language and direction ---
  s = s.replace('<html lang="en">', '<html lang="he" dir="rtl">');

  // --- make sure the Hebrew face is loaded (404 does not link it) ---
  s = s.replace(/(<link href="https:\/\/fonts\.googleapis\.com\/css2\?)([^"]*)"/, (m, head, q) =>
    q.includes('Frank+Ruhl+Libre') ? m : `${head}family=Frank+Ruhl+Libre:wght@400;500&${q}"`);

  // --- protect script blocks: they hold English strings we must not rewrite ---
  const scripts = [];
  s = s.replace(/<script\b[\s\S]*?<\/script>/g, (m) => {
    scripts.push(m);
    return ` @@SCRIPT${scripts.length - 1}@@ `;
  });

  // --- text nodes ---
  s = s.replace(/>([^<>]+)</g, (m, inner) => {
    const he = translate(inner);
    if (he === null) return m;
    const lead = inner.match(/^\s*/)[0];
    const trail = inner.match(/\s*$/)[0];
    return `>${lead}${escapeHtml(he)}${trail}<`;
  });

  // --- translatable attributes ---
  for (const attr of ['alt', 'title', 'aria-label', 'content', 'placeholder']) {
    s = s.replace(new RegExp(`${attr}="([^"]*)"`, 'g'), (m, val) => {
      const he = translate(val);
      return he === null ? m : `${attr}="${escapeHtml(he).replace(/"/g, '&quot;')}"`;
    });
  }

  // --- <title> ---
  s = s.replace(/<title>([^<]*)<\/title>/, (m, val) => {
    const he = translate(val);
    return he === null ? m : `<title>${escapeHtml(he)}</title>`;
  });

  // --- the display faces carry no Hebrew glyphs; fall back to the Hebrew serif ---
  s = s
    .replace(/'Pinyon Script',cursive/g, "'Frank Ruhl Libre',Georgia,serif")
    .replace(/'EB Garamond',Georgia,serif/g, "'Frank Ruhl Libre',Georgia,serif")
    .replace(/'Cormorant Garamond',Georgia,serif/g, "'Frank Ruhl Libre',Georgia,serif");

  // --- wide tracking is a Latin small-caps device; it pulls Hebrew words apart ---
  s = s.replace(/letter-spacing:\.(\d+)em/g, (m, d) =>
    Number(`0.${d}`) >= 0.1 ? 'letter-spacing:.03em' : m);

  // --- a nudge tuned for left-to-right has to flip ---
  s = s.replace(/translateX\(-10px\)/g, 'translateX(10px)');

  // --- internal links point at the Hebrew side ---
  s = s.replace(/href="(\/[^"]*)"/g, (m, href) => (ROUTES[href] ? `href="${ROUTES[href]}"` : m));

  // --- the switch now offers English ---
  const enHref = page === 'home' ? '/' : `/${page}`;
  s = s.replace(
    /<div class="lang-switch">[\s\S]*?<\/div>/,
    `<div class="lang-switch"><a href="${enHref}" lang="en" hreflang="en">EN</a>` +
      `<span class="lang-sep" aria-hidden="true"></span>` +
      `<span class="lang-on" lang="he">${HEBREW_LABEL}</span></div>`
  );

  scripts.forEach((block, i) => {
    s = s.replace(` @@SCRIPT${i}@@ `, block);
  });

  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `${page}.html`), s);
}

fs.rmSync(OUT, { recursive: true, force: true });
for (const page of PAGES) {
  build(page);
  console.log(`  public/he/${page}.html`);
}

if (missing.size) {
  console.log(`\n${missing.size} string(s) with no Hebrew - still showing in English:`);
  for (const m of missing) console.log(`  - ${m.length > 96 ? m.slice(0, 96) + '...' : m}`);
  process.exitCode = 1;
} else {
  console.log('\nEvery translatable string has Hebrew.');
}
