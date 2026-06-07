import { z } from 'zod';
export const createProviderSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  cpf_cnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  especialidade: z.string().min(1, 'Especialidade obrigatória'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  disponivel: z.boolean().optional()
});
export const updateProviderSchema = createProviderSchema.partial();
