import { Router } from 'express';
import * as ProviderController from '../controllers/provider.controller';
const router = Router();
router.get('/', ProviderController.getAll);
router.get('/:id', ProviderController.getById);
router.post('/', ProviderController.create);
router.put('/:id', ProviderController.update);
router.delete('/:id', ProviderController.remove);
export default router;
