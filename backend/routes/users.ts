import express from 'express';
import { createUser } from '../controllers/users';

const router = express.Router();

router.post('/', (req, res, next) => {
  createUser(req, res).catch(next);
});

export default router;
