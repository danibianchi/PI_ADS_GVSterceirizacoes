import { Request, Response } from 'express';
import * as ContractService from '../services/contract.service';
import { createContractSchema, updateContractSchema } from '../schemas/contract.schema';
export const getAll = async (req: Request, res: Response) => { res.json(await ContractService.getAllContracts()); };
export const getById = async (req: Request, res: Response) => { res.json(await ContractService.getContractById(req.params.id as string)); };
export const create = async (req: Request, res: Response) => {
  const validatedData = createContractSchema.parse(req.body);
  res.status(201).json(await ContractService.createContract(validatedData));
};
export const update = async (req: Request, res: Response) => {
  const validatedData = updateContractSchema.parse(req.body);
  res.json(await ContractService.updateContract(req.params.id as string, validatedData));
};
export const remove = async (req: Request, res: Response) => {
  await ContractService.deleteContract(req.params.id as string);
  res.status(204).send();
};
