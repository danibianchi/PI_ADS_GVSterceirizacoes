import { z } from 'zod';
export const createContractSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  prestadorId: z.string().min(1, 'Prestador é obrigatório'),
  data_inicio: z.string().or(z.date()),
  data_fim: z.string().or(z.date()).optional(),
  valor_acordado: z.number().or(z.string()).optional().transform(val => {
    if (typeof val === 'string') return Number(val.replace(/\D/g, '')) / 100;
    return val;
  }),
  status: z.string().optional()
});
export const updateContractSchema = createContractSchema.partial();
