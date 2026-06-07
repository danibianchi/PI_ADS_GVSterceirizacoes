import { Request, Response } from 'express';
import * as UserService from '../services/user.service';
import { loginSchema, registerSchema } from '../schemas/user.schema';

export const register = async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const user = await UserService.register(validatedData);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await UserService.login(validatedData.email, validatedData.senha);
  res.json(result);
};
