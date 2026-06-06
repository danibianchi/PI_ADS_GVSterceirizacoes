import { Request, Response } from 'express';
import { Provider } from '../models/Provider';
export const getProviders = async (req: Request, res: Response) => { const p = await Provider.find(); res.json(p); };
export const createProvider = async (req: Request, res: Response) => { const p = await Provider.create(req.body); res.json(p); };
export const updateProvider = async (req: Request, res: Response) => { const p = await Provider.findByIdAndUpdate(req.params.id, req.body, {new: true}); res.json(p); };
export const deleteProvider = async (req: Request, res: Response) => { await Provider.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
