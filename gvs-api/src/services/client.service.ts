import * as ClientRepository from '../repositories/client.repository';
import { IClient } from '../models/ClientTemp';

export const getAllClients = () => ClientRepository.findAll();

export const getClientById = (id: string) => ClientRepository.findById(id);

export const createClient = (data: Partial<IClient>) =>
  ClientRepository.create(data);

export const updateClient = (id: string, data: Partial<IClient>) =>
  ClientRepository.update(id, data);

export const deleteClient = (id: string) => ClientRepository.remove(id);