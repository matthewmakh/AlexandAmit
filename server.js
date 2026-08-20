const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

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

// Clean URLs — Travel & Stay is the landing page until the Home page is built.
const ROUTES = {
  '/': 'travel.html',
  '/travel': 'travel.html',
  '/events': 'events.html',
  '/gallery': 'gallery.html',
  '/newlywed-fund': 'newlywed-fund.html',
};

function send(res, status, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(status, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
  });
  fs.createReadStream(filePath).pipe(res);
}

function notFound(res) {
  const page = path.join(ROOT, '404.html');
  if (fs.existsSync(page)) return send(res, 404, page);
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
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

  const relative = ROUTES[pathname] || pathname.slice(1);
  const filePath = path.normalize(path.join(ROOT, relative));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return notFound(res);

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) return send(res, 200, filePath);
    // Allow extensionless URLs to resolve to their .html file.
    const withHtml = filePath + '.html';
    fs.stat(withHtml, (err2, stat2) => {
      if (!err2 && stat2.isFile()) return send(res, 200, withHtml);
      notFound(res);
    });
  });
}).listen(PORT, () => {
  console.log(`Amit & Alex wedding site listening on port ${PORT}`);
});
