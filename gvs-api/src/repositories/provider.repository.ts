import { Provider } from '../models/Provider';
export const findAll = () => Provider.find();
export const findById = (id: string) => Provider.findById(id);
export const findByCpfCnpj = (cpfCnpj: string) => Provider.findOne({ cpfCnpj });
export const create = (data: any) => Provider.create(data);
export const update = (id: string, data: any) => Provider.findByIdAndUpdate(id, data, { new: true });
export const remove = (id: string) => Provider.findByIdAndDelete(id);
