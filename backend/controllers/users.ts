import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user';

export const createUser = async (req: Request, res: Response) => {
  const { name, email, username, password } = req.body;

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password too short' });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, username, passwordHash });
  const savedUser = await user.save();

  return res.status(201).json({
    id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
    username: savedUser.username,
  });
};
