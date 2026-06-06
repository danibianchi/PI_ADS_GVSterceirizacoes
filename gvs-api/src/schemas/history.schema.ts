import { z } from 'zod';
export const createHistorySchema = z.object({
  acao: z.string().min(1),
  entidade: z.string().min(1),
  detalhes: z.any().optional(),
  data: z.string().or(z.date()).optional()
});
