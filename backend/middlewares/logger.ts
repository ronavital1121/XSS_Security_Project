import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'log.txt');

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  let body = 'No Body';
  try {
    if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
      body = 'No Body';
    } else if (Buffer.isBuffer(req.body)) {
      body = `<Buffer ${req.body.length} bytes>`;
    } else if (typeof req.body === 'string') {
      body = req.body;
    } else {
      body = JSON.stringify(req.body);
    }
  } catch (e) {
    body = 'Unserializable Body';
    console.error('Failed to serialize body:', e);
  }

  const logEntry = `${timestamp} | ${method} ${url} | Body: ${body}\r\n`;

  fs.appendFile(logPath, logEntry, { encoding: 'utf8' }, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });

  next();
};
