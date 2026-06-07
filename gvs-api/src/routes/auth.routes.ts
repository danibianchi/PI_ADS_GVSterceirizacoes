import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/register — Cria um novo usuário
router.post('/register', AuthController.register);

// POST /api/auth/login — Faz login e retorna o token JWT
router.post('/login', AuthController.login);

export default router;
