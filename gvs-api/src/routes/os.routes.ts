import { Router } from 'express';
import { getOS, createOS, updateOS, deleteOS } from '../controllers/os.controller';
const router = Router();
router.get('/', getOS);
router.post('/', createOS);
router.put('/:id', updateOS);
router.delete('/:id', deleteOS);
export default router;
