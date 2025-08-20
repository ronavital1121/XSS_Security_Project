import express from 'express';
import { getAllNotes, createNote, deleteNoteById, updateNoteById } from '../controllers/noteController';
import { userExtractor } from '../middlewares/tokenExtractor';

const notesRouter = express.Router();

notesRouter.get('/', getAllNotes);
notesRouter.post('/', userExtractor, createNote);
notesRouter.delete('/:id', userExtractor, deleteNoteById);
notesRouter.put('/:id', userExtractor, updateNoteById);

export default notesRouter;
