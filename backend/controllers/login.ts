import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  const passwordCorrect = user && (await bcrypt.compare(password, user.passwordHash));

  if (!user || !passwordCorrect) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET!, {
    expiresIn: '1h', // optional: token expiry
  });

  return res.status(200).json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
