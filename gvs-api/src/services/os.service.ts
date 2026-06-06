import * as OSRepository from '../repositories/os.repository';
import { AppError } from '../middlewares/AppError';
export const getAllOS = () => OSRepository.findAll();
export const getOSById = async (id: string) => {
  const os = await OSRepository.findById(id);
  if (!os) throw new AppError('Ordem de serviço não encontrada', 404);
  return os;
};
export const createOS = async (data: any) => { return OSRepository.create(data); };
export const updateOS = async (id: string, data: any) => {
  await getOSById(id);
  return OSRepository.update(id, data);
};
export const deleteOS = async (id: string) => {
  await getOSById(id);
  return OSRepository.remove(id);
};
