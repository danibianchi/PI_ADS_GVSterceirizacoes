import { Request, Response } from 'express';
import { History } from '../models/History';
export const getHistory = async (req: Request, res: Response) => { const h = await History.find().sort({ data: -1 }); res.json(h); };
export const createHistory = async (req: Request, res: Response) => { const h = await History.create(req.body); res.json(h); };
