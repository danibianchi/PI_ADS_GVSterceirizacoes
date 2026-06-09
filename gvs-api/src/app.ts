import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import authRoutes from './routes/auth.routes';
import clientRoutes from './routes/client.routes';
import providerRoutes from './routes/provider.routes';
import contractRoutes from './routes/contract.routes';
import osRoutes from './routes/os.routes';
import historyRoutes from './routes/history.routes';

import { authMiddleware } from './middlewares/auth.middleware';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    // Permite file://, localhost e qualquer origem nula (file protocol)
    if (!origin || origin === 'null' || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // em dev, libera tudo
    }
  },
  credentials: true
}));
app.use(express.json());

// 📚 Documentação Swagger — acessível em /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota de saúde pública (sem autenticação)
app.get('/', (req, res) => {
  res.json({ mensagem: 'API GVS Terceirizações funcionando! 🚀', docs: '/api-docs' });
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
