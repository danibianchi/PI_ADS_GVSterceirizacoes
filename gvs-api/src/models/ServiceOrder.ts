import mongoose from 'mongoose';
const osSchema = new mongoose.Schema({ 
    contratoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }, 
    descricao: String, 
    data_execucao: Date, 
    status: { type: String, default: 'pendente' }
}, { timestamps: true });
export const ServiceOrder = mongoose.model('ServiceOrder', osSchema);
