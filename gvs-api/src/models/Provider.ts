import mongoose from 'mongoose';
const providerSchema = new mongoose.Schema({ nome: String, cpfCnpj: String, tipoServico: String, status: String, contato: String });
export const Provider = mongoose.model('Provider', providerSchema);
