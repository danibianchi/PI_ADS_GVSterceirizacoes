import Client, { IClient } from '../models/Client';

export const findAll = () => Client.find();

export const findById = (id: string) => Client.findById(id);

export const findByCnpj = (cnpj: string) => Client.findOne({ cnpj });

export const create = (data: Partial<IClient>) => Client.create(data);

export const update = (id: string, data: Partial<IClient>) =>
  Client.findByIdAndUpdate(id, data, { new: true });

export const remove = (id: string) => Client.findByIdAndDelete(id);
