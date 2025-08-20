import express from 'express';
import Note from '../models/Note';
import User from '../models/user';
import { tokenExtractor, userExtractor } from '../middlewares/tokenExtractor';

const router = express.Router();

router.post(
  '/',
  tokenExtractor,
  userExtractor,
  async (req, res): Promise<void> => {
    const { title, content } = req.body;
    const user = await User.findById(req.user!.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;  // return to stop function execution
    }

    const note = new Note({
      title,
      content,
      author: { name: user.name, email: user.email },
      user: user._id,
    });

    const savedNote = await note.save();
    const populatedNote = await savedNote.populate('user', 'name email');
    res.status(201).json(populatedNote); // ✅ This includes author info

  }
);


export default router;
