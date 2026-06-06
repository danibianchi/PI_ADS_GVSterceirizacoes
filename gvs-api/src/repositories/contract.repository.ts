import { Contract } from '../models/Contract';
export const findAll = () => Contract.find().populate('cliente').populate('prestador');
export const findById = (id: string) => Contract.findById(id).populate('cliente').populate('prestador');
export const create = (data: any) => Contract.create(data);
export const update = (id: string, data: any) => Contract.findByIdAndUpdate(id, data, { new: true });
export const remove = (id: string) => Contract.findByIdAndDelete(id);
