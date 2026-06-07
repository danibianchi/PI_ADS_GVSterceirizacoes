import { Contract } from '../models/Contract';
export const findAll = () => Contract.find().populate('clienteId').populate('prestadorId');
export const findById = (id: string) => Contract.findById(id).populate('clienteId').populate('prestadorId');
export const create = (data: any) => Contract.create(data);
export const update = (id: string, data: any) => Contract.findByIdAndUpdate(id, data, { new: true });
export const remove = (id: string) => Contract.findByIdAndDelete(id);
