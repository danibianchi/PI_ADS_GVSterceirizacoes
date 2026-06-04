import * as ClientRepository from '../repositories/client.repository';
import { IClient } from '../models/Client';
import { AppError } from '../middlewares/AppError';

export const getAllClients = () => ClientRepository.findAll();

export const getClientById = async (id: string) => {
  const client = await ClientRepository.findById(id);
  if (!client) {
    throw new AppError('Cliente não encontrado', 404);
  }
  return client;
};

export const createClient = async (data: Partial<IClient>) => {
  if (data.cnpj) {
    const existing = await ClientRepository.findByCnpj(data.cnpj);
    if (existing) {
      throw new AppError('CNPJ já está cadastrado', 409);
    }
  }
  return ClientRepository.create(data);
};

export const updateClient = async (id: string, data: Partial<IClient>) => {
  // Garantir que existe antes de atualizar
  await getClientById(id);

  if (data.cnpj) {
    const existing = await ClientRepository.findByCnpj(data.cnpj);
    if (existing && existing._id.toString() !== id) {
      throw new AppError('CNPJ já pertence a outro cliente', 409);
    }
  }

  return ClientRepository.update(id, data);
};

export const deleteClient = async (id: string) => {
  // Verifica existência
  await getClientById(id);
  return ClientRepository.remove(id);
};