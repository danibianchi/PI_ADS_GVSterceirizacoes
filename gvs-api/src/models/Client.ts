import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  razao_social: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco?: string;
  status: 'ativo' | 'inativo';
}

const ClientSchema: Schema = new Schema(
  {
    razao_social: { type: String, required: true },
    cnpj: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },
    endereco: { type: String },
    status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' }
  },
  { timestamps: true }
);

export default mongoose.model<IClient>('Client', ClientSchema);