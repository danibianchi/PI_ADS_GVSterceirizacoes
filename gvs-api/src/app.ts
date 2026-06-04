import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import clientRoutes from './routes/client.routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API GVS Terceirizações funcionando! 🚀' });
});

app.use('/api/clientes', clientRoutes);

app.use(errorHandler);

export default app;