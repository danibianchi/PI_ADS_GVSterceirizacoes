import { z } from 'zod';
export const createContractSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  prestador: z.string().min(1, 'Prestador é obrigatório'),
  dataInicio: z.string().or(z.date()),
  dataTermino: z.string().or(z.date()).optional(),
  valor: z.number().min(0).optional(),
  status: z.string().optional()
});
export const updateContractSchema = createContractSchema.partial();
