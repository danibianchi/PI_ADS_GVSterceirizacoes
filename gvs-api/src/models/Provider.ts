import mongoose from 'mongoose';
const providerSchema = new mongoose.Schema({ nome: String, cpf_cnpj: String, especialidade: String, email: String, telefone: String, disponivel: { type: Boolean, default: true } });
export const Provider = mongoose.model('Provider', providerSchema);
