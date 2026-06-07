import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import providerRoutes from './routes/provider.routes';
import contractRoutes from './routes/contract.routes';
import osRoutes from './routes/os.routes';
import historyRoutes from './routes/history.routes';

import { authMiddleware } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rota de saúde pública (sem autenticação)
app.get('/', (req, res) => {
  res.json({ mensagem: 'API GVS Terceirizações funcionando! 🚀' });
});

// ✅ Rota de autenticação — PÚBLICA (não exige token)
app.use('/api/auth', authRoutes);

// 🔒 Rotas protegidas — exigem token JWT válido no header
app.use('/api/clientes', authMiddleware, clientRoutes);
app.use('/api/prestadores', authMiddleware, providerRoutes);
app.use('/api/contratos', authMiddleware, contractRoutes);
app.use('/api/ordens-servico', authMiddleware, osRoutes);
app.use('/api/historico', authMiddleware, historyRoutes);

// Middleware global de erros (sempre por último)
app.use(errorHandler);

export default app;
