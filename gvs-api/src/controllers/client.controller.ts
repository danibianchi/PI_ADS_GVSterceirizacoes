import { Request, Response } from 'express';
import * as ClientService from '../services/client.service';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

export const getAll = async (req: Request, res: Response) => {
  const clients = await ClientService.getAllClients();
  res.json(clients);
};

export const getById = async (req: Request, res: Response) => {
  const client = await ClientService.getClientById(req.params.id as string);
  res.json(client);
};

export const create = async (req: Request, res: Response) => {
  const validatedData = createClientSchema.parse(req.body);
  const client = await ClientService.createClient(validatedData);
  res.status(201).json(client);
};

export const update = async (req: Request, res: Response) => {
  const validatedData = updateClientSchema.parse(req.body);
  const client = await ClientService.updateClient(req.params.id as string, validatedData);
  res.json(client);
};

export const remove = async (req: Request, res: Response) => {
  await ClientService.deleteClient(req.params.id as string);
  res.status(204).send();
};