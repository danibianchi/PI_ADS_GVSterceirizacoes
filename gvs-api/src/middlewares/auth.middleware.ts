import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'gvs_secret_local_2025';

export interface AuthRequest extends Request {
  usuario?: { id: string; nome: string; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de autenticação não fornecido', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; nome: string; email: string };
    req.usuario = decoded;
    next();
  } catch {
    throw new AppError('Token inválido ou expirado', 401);
  }
};
