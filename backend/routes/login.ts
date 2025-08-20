import express from 'express';
import { login } from '../controllers/login';

const router = express.Router();

router.post('/', (req, res, next) => {
  login(req, res).catch(next);
});

export default router;
