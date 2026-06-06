import { Request, Response } from 'express';
import { Contract } from '../models/Contract';
export const getContracts = async (req: Request, res: Response) => { const c = await Contract.find().populate('cliente').populate('prestador'); res.json(c); };
export const createContract = async (req: Request, res: Response) => { const c = await Contract.create(req.body); res.json(c); };
export const updateContract = async (req: Request, res: Response) => { const c = await Contract.findByIdAndUpdate(req.params.id, req.body, {new: true}); res.json(c); };
export const deleteContract = async (req: Request, res: Response) => { await Contract.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
