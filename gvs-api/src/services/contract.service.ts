import * as ContractRepository from '../repositories/contract.repository';
import { AppError } from '../middlewares/AppError';
export const getAllContracts = () => ContractRepository.findAll();
export const getContractById = async (id: string) => {
  const c = await ContractRepository.findById(id);
  if (!c) throw new AppError('Contrato não encontrado', 404);
  return c;
};
export const createContract = async (data: any) => { return ContractRepository.create(data); };
export const updateContract = async (id: string, data: any) => {
  await getContractById(id);
  return ContractRepository.update(id, data);
};
export const deleteContract = async (id: string) => {
  await getContractById(id);
  return ContractRepository.remove(id);
};
