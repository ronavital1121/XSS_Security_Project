import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  } | null;
  user: Types.ObjectId;
}

const noteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: {
    name: String,
    email: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<INote>('Note', noteSchema);
