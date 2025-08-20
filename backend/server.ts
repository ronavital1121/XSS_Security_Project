import dotenv from 'dotenv';
import app from './expressApp';
import connectDB from './config/db';

dotenv.config();

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    await connectDB();
    console.log('Database connected!');

    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

startServer();
