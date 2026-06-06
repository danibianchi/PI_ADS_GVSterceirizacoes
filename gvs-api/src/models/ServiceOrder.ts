import mongoose from 'mongoose';
const osSchema = new mongoose.Schema({ contrato: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }, descricao: String, dataExecucao: Date, status: String, observacoes: String });
export const ServiceOrder = mongoose.model('ServiceOrder', osSchema);
