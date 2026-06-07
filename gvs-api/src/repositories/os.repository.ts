import { ServiceOrder } from '../models/ServiceOrder';
export const findAll = () => ServiceOrder.find().populate({ path: 'contratoId', populate: { path: 'clienteId prestadorId' }});
export const findById = (id: string) => ServiceOrder.findById(id).populate({ path: 'contratoId', populate: { path: 'clienteId prestadorId' }});
export const create = (data: any) => ServiceOrder.create(data);
export const update = (id: string, data: any) => ServiceOrder.findByIdAndUpdate(id, data, { new: true });
export const remove = (id: string) => ServiceOrder.findByIdAndDelete(id);
