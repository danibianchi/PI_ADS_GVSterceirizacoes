import mongoose from 'mongoose';
const historySchema = new mongoose.Schema({ acao: String, entidade: String, documentoId: String, detalhes: Object, data: { type: Date, default: Date.now } });
export const History = mongoose.model('History', historySchema);
