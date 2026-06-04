import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      erro: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      erro: 'Erro de validação nos dados enviados.',
      detalhes: err.issues.map((e: any) => ({ campo: e.path.join('.'), mensagem: e.message })),
    });
  }

  console.error('🔥 Erro Interno Capturado:', err);

  return res.status(500).json({
    status: 'error',
    erro: 'Erro interno no servidor.',
  });
};
