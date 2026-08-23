const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

// RSVP is handled by Paperless Post. Every RSVP control on the site links
// straight there, and /rsvp stays alive as a redirect so any link already
// shared with guests keeps working.
const RSVP_URL = process.env.RSVP_URL || 'https://pp.events/b4nMxdj7';

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

// Public pages, in nav order. RSVP is off-site, so it is not listed.
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
  const body = `User-agent: *\nAllow: /\nDisallow: /rsvp\n\nSitemap: ${siteOrigin(req)}/sitemap.xml\n`;
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

  // Anyone landing on the old RSVP page goes to the Paperless Post invitation.
  if (pathname === '/rsvp') {
    res.writeHead(302, { Location: RSVP_URL, 'Cache-Control': 'no-store' });
    return res.end();
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
