import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../repositories/user.repository';
import { AppError } from '../middlewares/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'gvs_secret_local_2025';

export const register = async (data: { nome: string; email: string; senha: string }) => {
  const existing = await UserRepository.findByEmail(data.email);
  if (existing) {
    throw new AppError('E-mail já cadastrado', 409);
  }

  const senhaHash = await bcrypt.hash(data.senha, 10);
  const user = await UserRepository.create({ ...data, senha: senhaHash });

  return { id: user._id, nome: user.nome, email: user.email };
};

export const login = async (email: string, senha: string) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) {
    throw new AppError('E-mail ou senha inválidos', 401);
  }

  const senhaValida = await bcrypt.compare(senha, user.senha);
  if (!senhaValida) {
    throw new AppError('E-mail ou senha inválidos', 401);
  }

  const token = jwt.sign(
    { id: user._id, nome: user.nome, email: user.email },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return { token, usuario: { id: user._id, nome: user.nome, email: user.email } };
};
