const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

// Where replies are appended. Point this at a mounted Railway volume to keep
// them across deploys; every reply is also written to the log as a safety net.
const DATA_DIR = process.env.RSVP_DATA_DIR || path.join(__dirname, 'data');
const RSVP_FILE = path.join(DATA_DIR, 'rsvps.jsonl');
// Optional: mirror each reply to a Zapier/Make/Sheets endpoint.
const WEBHOOK = process.env.RSVP_WEBHOOK_URL || '';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

const ROUTES = {
  '/': 'home.html',
  '/home': 'home.html',
  '/travel': 'travel.html',
  '/events': 'events.html',
  '/gallery': 'gallery.html',
  '/newlywed-fund': 'newlywed-fund.html',
  '/rsvp': 'rsvp.html',
};

const WEBP_SWAPPABLE = new Set(['.jpg', '.jpeg', '.png']);

// Every photo ships as both .jpg/.png and .webp. Browsers that advertise WebP
// get the smaller twin; everyone else gets the file the markup asked for.
function preferWebp(filePath, req) {
  if (!WEBP_SWAPPABLE.has(path.extname(filePath).toLowerCase())) return null;
  if (!(req.headers.accept || '').includes('image/webp')) return null;
  const twin = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
  return fs.existsSync(twin) ? twin : null;
}

function send(res, status, filePath, req) {
  const negotiated = req ? preferWebp(filePath, req) : null;
  const served = negotiated || filePath;
  const ext = path.extname(served).toLowerCase();
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
  };
  if (WEBP_SWAPPABLE.has(path.extname(filePath).toLowerCase())) headers.Vary = 'Accept';
  res.writeHead(status, headers);
  fs.createReadStream(served).pipe(res);
}

function notFound(res) {
  const page = path.join(ROOT, '404.html');
  if (fs.existsSync(page)) return send(res, 404, page);
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseBody(raw, contentType = '') {
  if (contentType.includes('application/json')) return JSON.parse(raw);
  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);

function validate(input) {
  const body = input && typeof input === 'object' ? input : {};
  const reply = {
    name: clean(body.name, 120),
    email: clean(body.email, 160),
    attending: clean(body.attending, 20),
    guests: clean(body.guests, 12),
    meal: clean(body.meal, 400),
    note: clean(body.note, 2000),
  };
  const errors = [];
  if (!reply.name) errors.push('Please tell us your name.');
  if (!reply.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reply.email)) errors.push('Please enter a valid email address.');
  if (reply.attending !== 'yes' && reply.attending !== 'no') errors.push('Please let us know whether you can join us.');
  if (reply.attending === 'yes' && !reply.guests) errors.push('Please choose how many will attend.');
  if (reply.attending === 'no') reply.guests = '0';
  return { reply, errors };
}

async function recordRsvp(reply) {
  const entry = { ...reply, receivedAt: new Date().toISOString() };
  // The log line is the durable record when no volume is mounted.
  console.log('RSVP ' + JSON.stringify(entry));
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(RSVP_FILE, JSON.stringify(entry) + '\n');
  } catch (err) {
    console.error('RSVP could not be written to ' + RSVP_FILE + ':', err.message);
  }
  if (WEBHOOK) {
    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      console.error('RSVP webhook failed:', err.message);
    }
  }
}

async function handleRsvp(req, res) {
  let body;
  try {
    body = parseBody(await readBody(req), req.headers['content-type'] || '');
  } catch {
    return json(res, 400, { ok: false, errors: ['We could not read that reply. Please try again.'] });
  }

  const { reply, errors } = validate(body);
  if (errors.length) return json(res, 422, { ok: false, errors });

  await recordRsvp(reply);

  // Browsers posting the form without JavaScript get a redirect they can see.
  if (!(req.headers['content-type'] || '').includes('application/json')) {
    res.writeHead(303, { Location: '/rsvp?sent=1' });
    return res.end();
  }
  return json(res, 200, { ok: true });
}

// Public pages, in nav order. RSVP is deliberately excluded — it is noindex.
const INDEXED = ['/', '/events', '/travel', '/newlywed-fund', '/gallery'];

function siteOrigin(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || (host.startsWith('localhost') ? 'http' : 'https');
  return `${proto}://${host}`;
}

function sitemap(req, res) {
  const origin = siteOrigin(req);
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    INDEXED.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join('\n') +
    '\n</urlset>\n';
  res.writeHead(200, { 'Content-Type': MIME['.xml'], 'Cache-Control': 'public, max-age=3600' });
  res.end(body);
}

function robots(req, res) {
  const body = `User-agent: *\nAllow: /\nDisallow: /rsvp\nDisallow: /api/\n\nSitemap: ${siteOrigin(req)}/sitemap.xml\n`;
  res.writeHead(200, { 'Content-Type': MIME['.txt'], 'Cache-Control': 'public, max-age=3600' });
  res.end(body);
}

http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Bad request');
  }
  if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);

  if (pathname === '/sitemap.xml') return sitemap(req, res);
  if (pathname === '/robots.txt') return robots(req, res);

  if (pathname === '/api/rsvp') {
    if (req.method !== 'POST') {
      res.writeHead(405, { Allow: 'POST', 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Method not allowed');
    }
    return handleRsvp(req, res).catch((err) => {
      console.error('RSVP failed:', err);
      json(res, 500, { ok: false, errors: ['Something went wrong on our end. Please try again, or message us on WhatsApp.'] });
    });
  }

  const relative = ROUTES[pathname] || pathname.slice(1);
  const filePath = path.normalize(path.join(ROOT, relative));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return notFound(res);

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return send(res, 200, filePath, req);
    // Allow extensionless URLs to resolve to their .html file.
    const withHtml = filePath + '.html';
    fs.stat(withHtml, (err2, stat2) => {
      if (!err2 && stat2.isFile()) return send(res, 200, withHtml, req);
      notFound(res);
    });
  });
}).listen(PORT, () => {
  console.log(`Amit & Alex wedding site listening on port ${PORT}`);
});
