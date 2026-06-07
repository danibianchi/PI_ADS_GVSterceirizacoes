import { User } from '../models/User';

export const findByEmail = (email: string) => User.findOne({ email });

export const create = (data: { nome: string; email: string; senha: string }) =>
  User.create(data);
