import { Router } from 'express';
import { getContracts, createContract, updateContract, deleteContract } from '../controllers/contract.controller';
const router = Router();
router.get('/', getContracts);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);
export default router;
