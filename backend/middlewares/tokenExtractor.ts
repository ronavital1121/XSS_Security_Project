import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';

export const tokenExtractor: RequestHandler = (req, res, next) => {
  const auth = req.get('authorization');
  console.log('Authorization Header:', auth); // 👈 LOG THIS
  if (auth?.toLowerCase().startsWith('bearer ')) {
    req.token = auth.substring(7);
    console.log('Extracted Token:', req.token); // 👈 LOG THIS
  }
  return next();
};

export const userExtractor: RequestHandler = (req, res, next) => {
  if (req.token) {
    try {
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET!);
      if (
        typeof decoded === 'object' &&
        'id' in decoded &&
        'username' in decoded &&
        'name' in decoded &&
        'email' in decoded
      ) {
        req.user = {
          id: decoded.id,
          username: decoded.username,
          name: decoded.name,
          email: decoded.email,
        };
      } else {
        res.status(401).json({ message: 'Invalid token payload' });
        return; // just return void here
      }
    } catch (err) {
      console.error('JWT verification failed:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
      return; // return void here, do NOT return the response object
    }
  }
  next();
};
