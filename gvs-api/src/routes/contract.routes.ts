import { Router } from 'express';
import * as ContractController from '../controllers/contract.controller';
const router = Router();
router.get('/', ContractController.getAll);
router.get('/:id', ContractController.getById);
router.post('/', ContractController.create);
router.put('/:id', ContractController.update);
router.delete('/:id', ContractController.remove);
export default router;
