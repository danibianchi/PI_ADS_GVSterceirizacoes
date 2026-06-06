import { Request, Response } from 'express';
import * as ProviderService from '../services/provider.service';
import { createProviderSchema, updateProviderSchema } from '../schemas/provider.schema';
export const getAll = async (req: Request, res: Response) => { res.json(await ProviderService.getAllProviders()); };
export const getById = async (req: Request, res: Response) => { res.json(await ProviderService.getProviderById(req.params.id as string)); };
export const create = async (req: Request, res: Response) => {
  const validatedData = createProviderSchema.parse(req.body);
  res.status(201).json(await ProviderService.createProvider(validatedData));
};
export const update = async (req: Request, res: Response) => {
  const validatedData = updateProviderSchema.parse(req.body);
  res.json(await ProviderService.updateProvider(req.params.id as string, validatedData));
};
export const remove = async (req: Request, res: Response) => {
  await ProviderService.deleteProvider(req.params.id as string);
  res.status(204).send();
};
