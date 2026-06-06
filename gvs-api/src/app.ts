import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import clientRoutes from './routes/client.routes';
import providerRoutes from './routes/provider.routes';
import contractRoutes from './routes/contract.routes';
import osRoutes from './routes/os.routes';
import historyRoutes from './routes/history.routes';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { res.json({ mensagem: 'API GVS Terceirizações funcionando! 🚀' }); });

app.use('/api/clientes', clientRoutes);
app.use('/api/prestadores', providerRoutes);
app.use('/api/contratos', contractRoutes);
app.use('/api/ordens-servico', osRoutes);
app.use('/api/historico', historyRoutes);

app.use(errorHandler);
export default app;
