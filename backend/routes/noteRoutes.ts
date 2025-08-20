import express from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNoteById,
  deleteNoteById,
  getNoteByIndex,
  updateNoteByIndex,
  deleteNoteByIndex
} from '../controllers/noteController';
import { tokenExtractor, userExtractor } from '../middlewares/tokenExtractor';



const router = express.Router();

router.get('/', getAllNotes);             // GET /notes
router.get('/:id', getNoteById);          // GET /notes/:id
router.post('/', tokenExtractor, userExtractor, createNote);
router.put('/:id', updateNoteById);       // PUT /notes/:id
router.delete('/:id', deleteNoteById);    // DELETE /notes/:id
router.get('/by-index/:i', getNoteByIndex);          // GET /notes/by-index/:i
router.put('/by-index/:i', updateNoteByIndex);       // PUT /notes/by-index/:i
router.delete('/by-index/:i', deleteNoteByIndex);    // DELETE /notes/by-index/:i


export default router;
