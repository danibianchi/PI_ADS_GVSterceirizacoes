import { z } from 'zod';
export const createProviderSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  tipoServico: z.string().min(1),
  status: z.string().optional(),
  contato: z.string().optional()
});
export const updateProviderSchema = createProviderSchema.partial();
