import { History } from '../models/History';
export const findAll = () => History.find().sort({ data: -1 });
export const create = (data: any) => History.create(data);
