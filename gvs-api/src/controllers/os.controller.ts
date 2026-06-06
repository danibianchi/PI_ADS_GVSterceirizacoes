import { Request, Response } from 'express';
import * as OSService from '../services/os.service';
import { createOSSchema, updateOSSchema } from '../schemas/os.schema';
export const getAll = async (req: Request, res: Response) => { res.json(await OSService.getAllOS()); };
export const getById = async (req: Request, res: Response) => { res.json(await OSService.getOSById(req.params.id as string)); };
export const create = async (req: Request, res: Response) => {
  const validatedData = createOSSchema.parse(req.body);
  res.status(201).json(await OSService.createOS(validatedData));
};
export const update = async (req: Request, res: Response) => {
  const validatedData = updateOSSchema.parse(req.body);
  res.json(await OSService.updateOS(req.params.id as string, validatedData));
};
export const remove = async (req: Request, res: Response) => {
  await OSService.deleteOS(req.params.id as string);
  res.status(204).send();
};
