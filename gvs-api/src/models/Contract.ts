import mongoose from 'mongoose';
const contractSchema = new mongoose.Schema({ 
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, 
    prestadorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }, 
    data_inicio: Date, 
    data_fim: Date, 
    valor_acordado: Number, 
    status: { type: String, default: 'ativo' }
}, { timestamps: true });
export const Contract = mongoose.model('Contract', contractSchema);
