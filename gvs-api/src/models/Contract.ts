import mongoose from 'mongoose';
const contractSchema = new mongoose.Schema({ cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, prestador: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }, dataInicio: Date, dataTermino: Date, valor: Number, status: String });
export const Contract = mongoose.model('Contract', contractSchema);
