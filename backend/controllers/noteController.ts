import { Request, Response } from 'express';
import * as noteService from '../services/index';

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query._page as string) || 1;
    const limit = parseInt(req.query._limit as string) || 10;

    if (page < 1 || limit < 1) {
      res.status(400).json({ message: 'Invalid pagination parameters' });
      return;
    }

    const { notes, totalCount } = await noteService.getAllNotes(page, limit);
    res.set('X-Total-Count', totalCount.toString());
    res.status(200).json(notes);
  } catch {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await noteService.getNoteById(req.params.id);
    res.status(200).json(note);
  } catch (err) {
    if ((err as Error).message === 'Note not found') {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.status(500).json({ message: 'Error retrieving note' });
    }
  }
};

export const createNote = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.id;
  if (!title || !content) {
    res.status(400).json({ message: 'Title and content are required' });
    return;
  }
  try {
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }
    else{
    const newNote = await noteService.createNote(title, content , userId);
    res.status(201).json(newNote);
    }
  } catch {
    res.status(400).json({ message: 'Error creating note' });
  }
};

export const updateNoteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ message: 'Title and content are required' });
    return;
  }
  try {
    const updatedNote = await noteService.updateNoteById(id, title, content);
    const populatedNote = await updatedNote.populate('user', 'name email');
    res.status(200).json(populatedNote);

  } catch (err) {
    if ((err as Error).message === 'Note not found') {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.status(500).json({ message: 'Failed to update note' });
    }
  }
};

export const deleteNoteById = async (req: Request, res: Response) => {
  try {
    await noteService.deleteNoteById(req.params.id);
    res.status(204).send();
  } catch (err) {
    if ((err as Error).message === 'Note not found') {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.status(500).json({ message: 'Failed to delete note' });
    }
  }
};

export const getNoteByIndex = async (req: Request, res: Response) => {
  const i = parseInt(req.params.i);
  if (isNaN(i) || i < 0) {
    res.status(400).json({ message: 'Invalid index' });
    return;
  }
  try {
    const note = await noteService.getNoteByIndex(i);
    res.status(200).json(note);
  } catch (err) {
    if ((err as Error).message === 'Note not found') {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.status(500).json({ message: 'Failed to retrieve note by index' });
    }
  }
};

export const updateNoteByIndex = async (req: Request, res: Response) => {
  const i = parseInt(req.params.i);
  if (isNaN(i) || i < 0) {
    res.status(400).json({ message: 'Invalid index' });
    return;
  }
  const { title, content } = req.body;
  if (!title || !content) {
    res.status(400).json({ message: 'Title and content are required' });
    return;
  }
  try {
    const updatedNote = await noteService.updateNoteByIndex(i, title, content);
    res.status(200).json(updatedNote);
  } catch (err) {
    if ((err as Error).message === 'Note not found') {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.status(500).json({ message: 'Failed to update note by index' });
    }
  }
};

export const deleteNoteByIndex = async (req: Request, res: Response) => {
  const i = parseInt(req.params.i);
  if (isNaN(i) || i < 0) {
    res.status(400).json({ message: 'Invalid index' });
    return;
  }
  try {
    await noteService.deleteNoteByIndex(i);
    res.status(204).send();
  } catch (err) {
    if ((err as Error).message === 'Note not found') {
      res.status(404).json({ message: 'Note not found' });
    } else {
      res.status(500).json({ message: 'Failed to delete note by index' });
    }
  }
};
