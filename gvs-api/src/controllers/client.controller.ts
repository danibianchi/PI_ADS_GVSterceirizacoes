import { Request, Response } from 'express';
import * as ClientService from '../services/client.service';

export const getAll = async (req: Request, res: Response) => {
  try {
    const clients = await ClientService.getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const client = await ClientService.getClientById(req.params.id);

    if (!client) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar cliente' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const client = await ClientService.createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao criar cliente' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const client = await ClientService.updateClient(req.params.id, req.body);

    if (!client) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.json(client);
  } catch (error) {
    res.status(400).json({ erro: 'Erro ao atualizar cliente' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const client = await ClientService.deleteClient(req.params.id);

    if (!client) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao deletar cliente' });
  }
};