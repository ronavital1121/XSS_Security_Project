import { Router } from 'express';
import Note from '../models/Note';

const router = Router();
router.delete('/clear-notes', async (req, res) => {
  try {
    await Note.deleteMany({});
    res.status(200).send('Cleared notes');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error clearing notes');
  }
});

export default router;
