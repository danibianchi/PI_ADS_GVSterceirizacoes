import { z } from 'zod';

export const createClientSchema = z.object({
  razao_social: z.string({ message: 'Razão social é obrigatória' }).min(3, 'Deve ter pelo menos 3 caracteres'),
  cnpj: z.string({ message: 'CNPJ é obrigatório' }).min(14, 'CNPJ inválido'),
  email: z.string({ message: 'E-mail é obrigatório' }).email('E-mail inválido'),
  telefone: z.string({ message: 'Telefone é obrigatório' }).min(10, 'Telefone inválido'),
  endereco: z.string().optional(),
  status: z.enum(['ativo', 'inativo']).optional(),
});

export const updateClientSchema = createClientSchema.partial();
