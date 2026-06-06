import { Router } from 'express';
import { getProviders, createProvider, updateProvider, deleteProvider } from '../controllers/provider.controller';
const router = Router();
router.get('/', getProviders);
router.post('/', createProvider);
router.put('/:id', updateProvider);
router.delete('/:id', deleteProvider);
export default router;
