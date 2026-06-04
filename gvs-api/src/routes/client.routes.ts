import { Router } from 'express';
import * as ClientController from '../controllers/client.controller';

const router = Router();

router.get('/', ClientController.getAll);
router.get('/:id', ClientController.getById);
router.post('/', ClientController.create);
router.put('/:id', ClientController.update);
router.delete('/:id', ClientController.remove);

export default router;