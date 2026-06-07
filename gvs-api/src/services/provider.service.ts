import * as ProviderRepository from '../repositories/provider.repository';
import { AppError } from '../middlewares/AppError';
export const getAllProviders = () => ProviderRepository.findAll();
export const getProviderById = async (id: string) => {
  const p = await ProviderRepository.findById(id);
  if (!p) throw new AppError('Prestador não encontrado', 404);
  return p;
};
export const createProvider = async (data: any) => {
  if (data.cpf_cnpj) {
    const existing = await ProviderRepository.findByCpfCnpj(data.cpf_cnpj);
    if (existing) throw new AppError('CPF/CNPJ já cadastrado', 409);
  }
  return ProviderRepository.create(data);
};
export const updateProvider = async (id: string, data: any) => {
  await getProviderById(id);
  if (data.cpf_cnpj) {
    const existing = await ProviderRepository.findByCpfCnpj(data.cpf_cnpj);
    if (existing && existing._id.toString() !== id) throw new AppError('CPF/CNPJ já pertence a outro prestador', 409);
  }
  return ProviderRepository.update(id, data);
};
export const deleteProvider = async (id: string) => {
  await getProviderById(id);
  return ProviderRepository.remove(id);
};
