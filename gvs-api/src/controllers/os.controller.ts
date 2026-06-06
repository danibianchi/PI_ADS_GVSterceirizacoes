import { Request, Response } from 'express';
import { ServiceOrder } from '../models/ServiceOrder';
export const getOS = async (req: Request, res: Response) => { const os = await ServiceOrder.find().populate({ path: 'contrato', populate: { path: 'cliente prestador' }}); res.json(os); };
export const createOS = async (req: Request, res: Response) => { const os = await ServiceOrder.create(req.body); res.json(os); };
export const updateOS = async (req: Request, res: Response) => { const os = await ServiceOrder.findByIdAndUpdate(req.params.id, req.body, {new: true}); res.json(os); };
export const deleteOS = async (req: Request, res: Response) => { await ServiceOrder.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
