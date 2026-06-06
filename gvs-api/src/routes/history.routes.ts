import { Router } from 'express';
import * as HistoryController from '../controllers/history.controller';
const router = Router();
router.get('/', HistoryController.getAll);
router.post('/', HistoryController.create);
export default router;
