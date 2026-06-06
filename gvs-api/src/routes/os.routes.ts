import { Router } from 'express';
import * as OSController from '../controllers/os.controller';
const router = Router();
router.get('/', OSController.getAll);
router.get('/:id', OSController.getById);
router.post('/', OSController.create);
router.put('/:id', OSController.update);
router.delete('/:id', OSController.remove);
export default router;
