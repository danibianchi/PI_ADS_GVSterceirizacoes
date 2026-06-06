import { Request, Response } from 'express';
import * as HistoryService from '../services/history.service';
import { createHistorySchema } from '../schemas/history.schema';
export const getAll = async (req: Request, res: Response) => { res.json(await HistoryService.getAllHistory()); };
export const create = async (req: Request, res: Response) => {
  const validatedData = createHistorySchema.parse(req.body);
  res.status(201).json(await HistoryService.createHistory(validatedData));
};
