import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3130;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript',
  '.mjs': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  let filePath = path.join(__dirname, urlPath);
  if (!path.extname(filePath)) filePath += '.html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  Conley Consulting Group running at http://localhost:${PORT}\n  Press Ctrl+C to stop.\n`);
});
