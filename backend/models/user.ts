import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>({
  name: String,
  email: String,
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

export default mongoose.model<IUser>('User', userSchema);
