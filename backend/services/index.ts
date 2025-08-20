import Note from '../models/Note';
import User from '../models/user';


export const getAllNotes = async (page: number, limit: number) => {
  const totalCount = await Note.countDocuments().exec();

  const notes = await Note.find()
    .populate('user', 'name email') // 👈 this adds author info
    .sort({ _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  return { notes, totalCount };
};

export const getNoteById = async (id: string) => {
  const note = await Note.findById(id)
    .populate('user', 'name email')
    .exec();
  if (!note) throw new Error('Note not found');
  return note;
};

export const createNote = async (title: string, content: string, userId: string) => {
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new Error('User not found');
  }

  const newNote = new Note({
    title,
    content,
    user: user._id,
    author: {
      name: user.name,
      email: user.email,
    },
  });

  return await newNote.save();
};

export const updateNoteById = async (id: string, title: string, content: string) => {
  const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true })
    .populate('user', 'name email')
    .exec();
  if (!updatedNote) throw new Error('Note not found');
  return updatedNote;
};

export const deleteNoteById = async (id: string) => {
  const deletedNote = await Note.findByIdAndDelete(id).exec();
  if (!deletedNote) throw new Error('Note not found');
};

export const getNoteByIndex = async (i: number) => {
  const notes = await Note.find()
    .sort({ _id: -1 })
    .skip(i)
    .limit(1)
    .exec();
  if (!notes || notes.length === 0) throw new Error('Note not found');
  return notes[0];
};

export const updateNoteByIndex = async (i: number, title: string, content: string) => {
  const notes = await Note.find()
    .sort({ _id: -1 })
    .skip(i)
    .limit(1)
    .exec();
  if (!notes || notes.length === 0) throw new Error('Note not found');

  const updatedNote = await Note.findByIdAndUpdate(notes[0]._id, { title, content }, { new: true }).exec();
  if (!updatedNote) throw new Error('Note not found');
  return updatedNote;
};

export const deleteNoteByIndex = async (i: number) => {
  const notes = await Note.find()
    .sort({ _id: -1 })
    .skip(i)
    .limit(1)
    .exec();
  if (!notes || notes.length === 0) throw new Error('Note not found');

  await Note.findByIdAndDelete(notes[0]._id).exec();
};
