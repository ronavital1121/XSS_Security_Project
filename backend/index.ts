import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import notesRouter from './routes/notes';
import usersRouter from './routes/users';
import loginRouter from './routes/login';

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log('Connected to MongoDB');
});

app.use('/notes', notesRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
