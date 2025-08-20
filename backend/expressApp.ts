import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import noteRoutes from './routes/noteRoutes';
import { logger } from './middlewares/logger';
import testRouter from './tests/testRouter';
import userRoutes from './routes/users';
import loginRouter from './routes/login';
import { tokenExtractor, userExtractor } from './middlewares/tokenExtractor';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  exposedHeaders: ['X-Total-Count'],
}));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(logger);

// Extract token from header
app.use(tokenExtractor);

// Decode token and set user if valid
app.use(userExtractor);

// Now req.user is available in all routes

app.use('/notes', noteRoutes);
app.use('/users', userRoutes);
app.use('/login', loginRouter);

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') {
  app.use('/test', testRouter);
}

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

export default app;
