import { z } from 'zod';
export const createOSSchema = z.object({
  contratoId: z.string().min(1, 'Contrato é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  data_execucao: z.string().or(z.date()),
  status: z.string().optional()
});
export const updateOSSchema = createOSSchema.partial();
