import { z } from 'zod';
export const createOSSchema = z.object({
  contrato: z.string().min(1, 'Contrato é obrigatório'),
  descricao: z.string().min(3),
  dataExecucao: z.string().or(z.date()).optional(),
  status: z.string().optional(),
  observacoes: z.string().optional()
});
export const updateOSSchema = createOSSchema.partial();
