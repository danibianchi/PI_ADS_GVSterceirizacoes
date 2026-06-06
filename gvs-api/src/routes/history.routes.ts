import { Router } from 'express';
import { getHistory, createHistory } from '../controllers/history.controller';
const router = Router();
router.get('/', getHistory);
router.post('/', createHistory);
export default router;
