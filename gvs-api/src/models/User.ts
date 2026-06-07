import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  nome: string;
  email: string;
  senha: string;
}

const userSchema = new mongoose.Schema<IUser>({
  nome: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  senha: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
